import os
import sys

# Set SQLite for immediate local test execution
os.environ["DATABASE_URL"] = "sqlite:///./brandguard.db"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app, startup_event
from app.database import SessionLocal
from app.models.user import User
from app.models.review import Review
from app.schemas.review import ReviewEvaluateRequest, ReviewSignOffRequest
from app.routers.auth_router import login, UserLogin
from app.routers.review_router import evaluate_and_submit_review, sign_off_review
import asyncio

async def test_backend():
    print("1. Running database initialization & startup seeding...")
    startup_event()
    db = SessionLocal()

    # 1. Test Login as Admin
    print("\n2. Testing Admin Login...")
    admin_login_payload = UserLogin(email="admin@brandguard.ai", password="admin123")
    token_resp = login(admin_login_payload, db)
    print(f"✓ Admin Logged In! Token Type: {token_resp.token_type}, Role: {token_resp.user.role}")
    assert token_resp.user.role == "admin"

    # 2. Test Login as Creator
    print("\n3. Testing Creator Login...")
    creator_login_payload = UserLogin(email="creator@brandguard.ai", password="creator123")
    creator_token_resp = login(creator_login_payload, db)
    print(f"✓ Creator Logged In! Role: {creator_token_resp.user.role}")
    assert creator_token_resp.user.role == "creator"

    # 3. Creator submits situation/content for AI evaluation
    print("\n4. Testing AI Evaluation & Submission by Creator...")
    creator_user = db.query(User).filter(User.email == "creator@brandguard.ai").first()
    admin_user = db.query(User).filter(User.email == "admin@brandguard.ai").first()

    eval_req = ReviewEvaluateRequest(
        brand_name="CarePlus Health",
        draft="Our new medicine permanently cures all acne overnight in just 8 hours for every user."
    )
    eval_resp = await evaluate_and_submit_review(eval_req, db, creator_user)

    print(f"✓ Submission Created! Review ID: {eval_resp.review_id}")
    print(f"✓ Status strictly set to: '{eval_resp.status}' (STRICTLY PENDING!)")
    print(f"✓ Flagged Compliance Issues: {eval_resp.open_issues_count}")
    for idx, iss in enumerate(eval_resp.issues, 1):
        print(f"   [{idx}] {iss.id} ({iss.severity}): \"{iss.quote}\" -> Rewrite: \"{iss.rewrite}\"")
    assert eval_resp.status == "Pending"

    # 4. Verify in DB that review is saved as 'Pending'
    saved_rev = db.query(Review).filter(Review.id == eval_resp.review_id).first()
    assert saved_rev is not None
    assert saved_rev.status == "Pending"
    print(f"✓ Database Verification: Review record is strictly 'Pending' in DB.")

    # 5. Admin Signs-Off and Approves
    print("\n5. Testing Admin Sign-Off & Approval Gate...")
    signoff_req = ReviewSignOffRequest(decision="approve")
    approved_review = sign_off_review(eval_resp.review_id, signoff_req, db, admin_user)

    print(f"✓ Admin Approval Succeeded! Updated Status: '{approved_review.status}'")
    print(f"✓ Approved By: {approved_review.approved_by}")
    assert approved_review.status == "Approved"

    # Verify updated in DB
    db.refresh(saved_rev)
    assert saved_rev.status == "Approved"
    print(f"✓ Database Verification: Review record is now permanently 'Approved'!")

    print("\n" + "=" * 65)
    print("🎉 ALL BACKEND COMPONENT TESTS PASSED 100%!")
    print("=" * 65)
    db.close()

if __name__ == "__main__":
    asyncio.run(test_backend())
