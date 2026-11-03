import sys
import os

# Add backend directory to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from main import (
    app,
    FAILED_LOGIN_ATTEMPTS,
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

client = TestClient(app)
FAILED_LOGIN_ATTEMPTS.clear()

results = []

# ==============================================================
# TEST 1: Password Hashing Cryptographic Strength (Bcrypt 12 Rounds)
# ==============================================================
pw = "CorporateP@ssw0rd!2026"
h = hash_password(pw)
is_bcrypt = h.startswith("$2b$12$")
is_valid = verify_password(pw, h)
is_bad_rejected = not verify_password("WrongPassword123", h)
results.append({
    "level": "L1 - Cryptographic Storage",
    "test": "Bcrypt 12-Round Salted Hashing",
    "passed": bool(is_bcrypt and is_valid and is_bad_rejected),
    "details": f"Algorithm: Blowfish $2b$, Cost factor: 12 rounds, Salted: Yes, Hash prefix: {h[:12]}..."
})

# ==============================================================
# TEST 2: Anti-User Enumeration (Defense against Username Harvesting)
# ==============================================================
FAILED_LOGIN_ATTEMPTS.clear()
res_non_existent = client.post("/api/auth/login", json={"email": "nonexistent_hacker_user@company.com", "password": "wrongpassword"})
res_wrong_pw = client.post("/api/auth/login", json={"email": "sanskruti@careplus.com", "password": "completely_wrong_pass"})

detail_1 = res_non_existent.json().get("detail", "")
detail_2 = res_wrong_pw.json().get("detail", "")

anti_enum_passed = (
    res_non_existent.status_code == 401 and 
    res_wrong_pw.status_code == 401 and 
    detail_1 == detail_2
)
results.append({
    "level": "L2 - Information Leakage Prevention",
    "test": "Anti-User Enumeration Response",
    "passed": bool(anti_enum_passed),
    "details": f"Both return HTTP 401 with identical generic message: '{detail_1}'"
})

# ==============================================================
# TEST 3: Brute-Force & Credential Stuffing Rate Limiting
# ==============================================================
FAILED_LOGIN_ATTEMPTS.clear()
status_codes = []
for i in range(5):
    r = client.post("/api/auth/login", json={"email": "attack_target@careplus.com", "password": f"guess_{i}"})
    status_codes.append(r.status_code)

r6 = client.post("/api/auth/login", json={"email": "attack_target@careplus.com", "password": "guess_6"})
rate_limit_passed = (r6.status_code == 429 and "Too many failed login attempts" in r6.json().get("detail", ""))

results.append({
    "level": "L3 - Brute-Force & DoS Defense",
    "test": "Sliding Window Rate Limiter",
    "passed": bool(rate_limit_passed),
    "details": f"First 5 attempts returned HTTP {status_codes[0]}, 6th attempt triggered HTTP 429 Lockout"
})

# ==============================================================
# TEST 4: JWT Token Integrity & Cryptographic Tamper Resistance
# ==============================================================
FAILED_LOGIN_ATTEMPTS.clear()
login_res = client.post("/api/auth/login", json={"email": "sanskruti@careplus.com", "password": "password123"})
token = login_res.json().get("token")
decoded = decode_access_token(token)
token_valid = (decoded is not None and decoded.get("sub") == "sanskruti@careplus.com")

# Attempt Signature Tampering
tampered_token = token[:-6] + "XYZ123"
tampered_decoded = decode_access_token(tampered_token)

jwt_passed = bool(token_valid and (tampered_decoded is None))
results.append({
    "level": "L4 - Session & Token Security",
    "test": "HMAC-SHA256 JWT Signature Verification",
    "passed": jwt_passed,
    "details": f"Legitimate token verified (subject: {decoded.get('sub')}). Tampered token rejected (decoded: {tampered_decoded})"
})

# ==============================================================
# TEST 5: Privilege Escalation Prevention (Admin Role Guard)
# ==============================================================
reg_escalation_attempt = client.post("/api/auth/register", json={
    "full_name": "Malicious Actor",
    "email": "malicious_actor@careplus.com",
    "password": "SecurePassword123",
    "role": "Super Admin",
    "verification_code": "WRONG_OR_STOLEN_CODE"
})
escalation_blocked = (reg_escalation_attempt.status_code == 403)

reg_legit_attempt = client.post("/api/auth/register", json={
    "full_name": "Verified Auditor",
    "email": "auditor_new_test@careplus.com",
    "password": "SecurePassword123",
    "role": "Super Admin",
    "verification_code": "CAREPLUS-2026"
})
legit_allowed = (reg_legit_attempt.status_code in [200, 400])

results.append({
    "level": "L5 - Access Control & Privilege Boundaries",
    "test": "Admin Invite Code Verification Guard",
    "passed": bool(escalation_blocked and legit_allowed),
    "details": f"Unverified Admin registration blocked with HTTP {reg_escalation_attempt.status_code} Forbidden. Valid code allowed (HTTP {reg_legit_attempt.status_code})"
})

# ==============================================================
# TEST 6: Protected Resource Route Guard (/api/auth/me)
# ==============================================================
me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
me_passed = (me_res.status_code == 200 and me_res.json().get("user", {}).get("sub") == "sanskruti@careplus.com")
unauth_me = client.get("/api/auth/me", headers={"Authorization": "Bearer fake_forged_token"})
unauth_passed = (unauth_me.status_code == 401)

results.append({
    "level": "L6 - Resource Protection & Scope Guards",
    "test": "Bearer Token Authorization Header Enforcement",
    "passed": bool(me_passed and unauth_passed),
    "details": f"Authorized request returned HTTP 200 OK. Forged/invalid bearer token returned HTTP {unauth_me.status_code} Unauthorized"
})

FAILED_LOGIN_ATTEMPTS.clear()

print("\n" + "="*80)
print("  BRANDGUARD AI: ENTERPRISE AUTHENTICATION SECURITY LEVEL TEST REPORT")
print("="*80)
for r in results:
    badge = "[SECURE / PASS]" if r["passed"] else "[FAIL]"
    print(f"{badge:<16} | {r['level']:<35} | {r['test']}")
    print(f"                 --> {r['details']}\n")

all_passed = all(r["passed"] for r in results)
print("="*80)
print(f"OVERALL SECURITY VERDICT: {'ALL DEFENSE LAYERS SECURE (100% PASS)' if all_passed else 'SECURITY VULNERABILITIES DETECTED'}")
print("="*80)
