import React, { useState, useEffect } from 'react'

export default function WebhookDeliveryArchitecture({
  currentUser,
  onShowToast,
  onNavigateToQueue,
  initialTab = 'diagram'
}) {
  const [activeTab, setActiveTab] = useState(initialTab === 'endpoints' ? 'endpoints' : 'diagram')

  useEffect(() => {
    if (initialTab === 'endpoints' || initialTab === 'diagram') {
      setActiveTab(initialTab)
    }
  }, [initialTab])
  const [isTracing, setIsTracing] = useState(false)
  const [activeStageIndex, setActiveStageIndex] = useState(null)
  const [traceMode, setTraceMode] = useState('success') // 'success' | 'retry'
  const [traceLogs, setTraceLogs] = useState([])
  const [traceResult, setTraceResult] = useState(null)

  // Customer Endpoints State (Customer UI from diagram)
  const [endpoints, setEndpoints] = useState(() => {
    try {
      const saved = localStorage.getItem('brandguard_customer_endpoints')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return [
      {
        id: 'ep_cms_prod',
        name: 'CarePlus Headless CMS (Prod)',
        url: 'https://cms.careplushealth.com/api/v1/brandguard-webhook',
        secretKey: 'whsec_prod_8f11a82b994c1a',
        events: ['review.approved', 'review.rejected', 'content.updated'],
        status: 'healthy',
        lastStatusCode: 200,
        lastLatencyMs: 38,
        lastAttempt: 'Just now',
        failureCount: 0,
        successCount: 142
      },
      {
        id: 'ep_slack_alerts',
        name: 'Marketing Slack Bot (#brand-governance)',
        url: 'https://hooks.slack.com/services/T04G/B082/brandguard-notifications',
        secretKey: 'whsec_slack_c991f24d7809',
        events: ['review.approved', 'review.rejected', 'compliance.flagged'],
        status: 'healthy',
        lastStatusCode: 200,
        lastLatencyMs: 52,
        lastAttempt: '12m ago',
        failureCount: 0,
        successCount: 89
      },
      {
        id: 'ep_meta_agency',
        name: 'Ad Agency Meta Dispatch Proxy',
        url: 'https://api.meta-agency.internal/v2/creative-approval-webhook',
        secretKey: 'whsec_agency_77a23b10ec9',
        events: ['review.approved'],
        status: 'requeueing',
        lastStatusCode: 503,
        lastLatencyMs: 118,
        lastAttempt: '3m ago',
        failureCount: 2,
        successCount: 31
      }
    ]
  })

  // Add Endpoint Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEndpointName, setNewEndpointName] = useState('')
  const [newEndpointUrl, setNewEndpointUrl] = useState('')
  const [newEndpointSecret, setNewEndpointSecret] = useState('')
  const [newEndpointEvents, setNewEndpointEvents] = useState(['review.approved', 'review.rejected'])

  // Save endpoints to localStorage
  const saveEndpoints = (updated) => {
    setEndpoints(updated)
    try {
      localStorage.setItem('brandguard_customer_endpoints', JSON.stringify(updated))
    } catch (e) {}
  }

  // Stages matching the uploaded Architecture Diagram
  const ARCHITECTURE_STAGES = [
    {
      id: 'api_customer',
      title: 'API Customer',
      subtitle: 'Inbound Sources',
      tag: 'Ingress Source',
      tagColor: '#38bdf8',
      icon: '🌐',
      desc: 'External platforms (Figma, Canva, Slack, Meta Ads) emit event payloads via HTTP POST.',
      spec: 'TLS 1.3 / JSON Payload'
    },
    {
      id: 'waf_lb',
      title: 'Load Balancer & WAF',
      subtitle: 'Edge Security',
      tag: 'Shield / Proxy',
      tagColor: '#a78bfa',
      icon: '🛡️',
      desc: 'AWS ALB with WAF rate limiting (1,000 req/min), DDoS mitigation, IP geo-allowlists.',
      spec: '0.8ms termination'
    },
    {
      id: 'webhook_service',
      title: 'Webhook Delivery Service',
      subtitle: 'Core VPC Microservice',
      tag: 'FastAPI / Engine',
      tagColor: 'var(--mint, #baf57f)',
      icon: '⚙️',
      desc: 'Validates JSONSchema, extracts tenant ID, checks permissions, and prepares job execution.',
      spec: 'Async Event Router'
    },
    {
      id: 'caching_storage',
      title: 'Storage & Redis Cache',
      subtitle: 'Deduplication & DB',
      tag: 'Redis + PostgreSQL',
      tagColor: '#34d399',
      icon: '💾',
      desc: 'Redis enforces idempotency tokens (TTL: 24h); PostgreSQL stores immutable webhook audit logs.',
      spec: 'Sub-millisecond dedupe'
    },
    {
      id: 'task_queue',
      title: 'Task Queue (Celery / SQS)',
      subtitle: 'Message Broker',
      tag: 'FIFO Queue',
      tagColor: '#fbbf24',
      icon: '📥',
      desc: 'Buffers high-volume bursts to protect downstream services from spikes. High priority P1.',
      spec: 'Zero-loss buffering'
    },
    {
      id: 'dispatch_workers',
      title: 'Webhook Dispatch Workers',
      subtitle: 'HMAC Signing & Retries',
      tag: 'Worker Pool (x4)',
      tagColor: '#f43f5e',
      icon: '👷',
      desc: 'Signs each request with a unique HMAC-SHA256 key per endpoint. Requeues failed attempts with exponential backoff.',
      spec: 'Per-endpoint secret keys'
    },
    {
      id: 'vpc_peering',
      title: 'VPC Peering & Outbound Proxy',
      subtitle: 'Network Isolation',
      tag: 'NAT Gateway',
      tagColor: '#60a5fa',
      icon: '🔀',
      desc: 'Routes outbound egress through static IPs (198.51.100.24) to isolate VPC from public internet.',
      spec: 'Dedicated egress proxy'
    },
    {
      id: 'customer_endpoints',
      title: 'Customer Endpoints',
      subtitle: 'Target CMS / Webhooks',
      tag: 'Destination',
      tagColor: '#22c55e',
      icon: '🎯',
      desc: 'Customer systems receive verified delivery payloads with cryptographic signature verification.',
      spec: 'HTTP 200 OK (38ms)'
    }
  ]

  // Run Animated Pipeline Trace
  const handleRunTrace = async (isRetryMode = false) => {
    if (isTracing) return
    setIsTracing(true)
    setTraceMode(isRetryMode ? 'retry' : 'success')
    setTraceLogs([])
    setActiveStageIndex(0)

    const stageDelays = [400, 500, 600, 500, 600, 700, 500, 800]
    const logsAccumulator = []

    const addLog = (stage, detail, status = 'OK') => {
      const logEntry = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        stage,
        detail,
        status
      }
      logsAccumulator.push(logEntry)
      setTraceLogs([...logsAccumulator])
    }

    addLog('API Customer', 'Inbound webhook event received: "content.submitted" (Figma Vector Asset)', 'STARTED')

    for (let i = 0; i < ARCHITECTURE_STAGES.length; i++) {
      setActiveStageIndex(i)
      await new Promise((r) => setTimeout(r, stageDelays[i]))

      if (i === 1) {
        addLog('Load Balancer & WAF', 'ALB TLS 1.3 handshake verified. WAF rate limiter checked (34 req/sec). Zero threats detected.', 'PASSED')
      } else if (i === 2) {
        addLog('Webhook Delivery Service', 'JSONSchema validated. Org "CarePlus Health" authorized. Event ID: ev_8f99a1b2 committed.', 'ACCEPTED')
      } else if (i === 3) {
        addLog('Storage & Redis Cache', 'Redis idempotency key SETNX: SUCCESS. State persisted to PostgreSQL table webhook_events.', 'PERSISTED')
      } else if (i === 4) {
        addLog('Task Queue', 'Message queued to Celery/SQS FIFO topic "brandguard.dispatch.p1" (Task ID: tsk_c701f4).', 'QUEUED')
      } else if (i === 5) {
        const secret = endpoints[0]?.secretKey || 'whsec_prod_8f11a82b99'
        addLog('Dispatch Workers', `Worker #2 dequeued task. Calculated HMAC-SHA256 signature using secret (${secret.slice(0, 10)}...).`, 'SIGNED')
      } else if (i === 6) {
        addLog('VPC Peering', 'Traffic directed through VPC Peering & outbound NAT gateway (Egress IP: 198.51.100.24).', 'ROUTED')
      } else if (i === 7) {
        if (!isRetryMode) {
          addLog('Customer Endpoints', 'POST https://cms.careplushealth.com/api/v1/brandguard-webhook delivered. HTTP 200 OK (38ms).', 'DELIVERED')
        } else {
          addLog('Customer Endpoints', 'POST https://api.meta-agency.internal/v2/... returned HTTP 503 Service Unavailable.', 'FAILED')
          addLog('Retry Engine', 'Worker caught 503. Requeued task into Backoff Task Queue (Attempt 2/3 scheduled in 15s).', 'REQUEUED')
        }
      }
    }

    setIsTracing(false)
    setActiveStageIndex(null)

    const finalResult = {
      success: !isRetryMode,
      taskId: 'tsk_c701f4_99a',
      signature: 'sha256=a891f7c2098bca440912fbe987102e3b123984af',
      latency: isRetryMode ? '142ms' : '38ms',
      status: !isRetryMode ? 'DELIVERED_200_OK' : 'REQUEUED_EXPONENTIAL_BACKOFF',
      completedAt: new Date().toLocaleTimeString()
    }
    setTraceResult(finalResult)

    if (onShowToast) {
      onShowToast(
        !isRetryMode
          ? '⚡ Webhook Delivery Architecture Trace Completed: HTTP 200 OK Delivered via VPC!'
          : '🔄 Requeue & Retry Flow Simulated: Transient 503 handled with exponential backoff!'
      )
    }
  }

  // Handle Add Endpoint
  const handleAddEndpoint = (e) => {
    e.preventDefault()
    if (!newEndpointName.trim() || !newEndpointUrl.trim()) return

    const newEp = {
      id: `ep_${Date.now()}`,
      name: newEndpointName.trim(),
      url: newEndpointUrl.trim(),
      secretKey: newEndpointSecret.trim() || `whsec_${Math.random().toString(36).substring(2, 12)}`,
      events: newEndpointEvents,
      status: 'healthy',
      lastStatusCode: 200,
      lastLatencyMs: 42,
      lastAttempt: 'Never tested',
      failureCount: 0,
      successCount: 0
    }

    saveEndpoints([newEp, ...endpoints])
    setShowAddModal(false)
    setNewEndpointName('')
    setNewEndpointUrl('')
    setNewEndpointSecret('')
    if (onShowToast) onShowToast(`Added destination endpoint "${newEp.name}"!`)
  }

  // Handle Delete Endpoint
  const handleDeleteEndpoint = (id) => {
    const updated = endpoints.filter((e) => e.id !== id)
    saveEndpoints(updated)
    if (onShowToast) onShowToast('Removed destination webhook endpoint.')
  }

  // Handle Test Dispatch for specific endpoint
  const handleTestDispatchEndpoint = (ep) => {
    if (onShowToast) onShowToast(`Testing outbound dispatch to ${ep.name}...`)
    setTimeout(() => {
      const updated = endpoints.map((item) => {
        if (item.id === ep.id) {
          return {
            ...item,
            lastAttempt: 'Just now',
            lastStatusCode: 200,
            lastLatencyMs: Math.floor(30 + Math.random() * 35),
            status: 'healthy',
            successCount: (item.successCount || 0) + 1
          }
        }
        return item
      })
      saveEndpoints(updated)
      if (onShowToast) onShowToast(`✅ Webhook dispatched successfully to ${ep.name} (HTTP 200 OK)!`)
    }, 1200)
  }

  // Handle Requeue & Retry for failed endpoint
  const handleRetryEndpoint = (ep) => {
    if (onShowToast) onShowToast(`Requeueing failed webhook attempts for ${ep.name}...`)
    setTimeout(() => {
      const updated = endpoints.map((item) => {
        if (item.id === ep.id) {
          return {
            ...item,
            status: 'healthy',
            lastStatusCode: 200,
            failureCount: 0,
            lastAttempt: 'Retried just now',
            lastLatencyMs: 44,
            successCount: (item.successCount || 0) + 1
          }
        }
        return item
      })
      saveEndpoints(updated)
      if (onShowToast) onShowToast(`✅ Retry successful! Worker verified endpoint ${ep.name} recovered (HTTP 200 OK).`)
    }, 1400)
  }

  return (
    <div style={{ color: '#edf4f5', fontFamily: 'Manrope, sans-serif' }}>
      {/* Sub-Header & Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'linear-gradient(135deg, #0e1c26 0%, #101c24 100%)',
          border: '1px solid #1e3545',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}
            >
              VPC ARCHITECTURE
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'rgba(186, 245, 127, 0.15)',
                color: 'var(--mint, #baf57f)',
                border: '1px solid rgba(186, 245, 127, 0.3)'
              }}
            >
              TASK QUEUE &amp; WORKERS ACTIVE
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#edf4f5' }}>
            Webhook Delivery &amp; Processing Architecture
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#829ca9', maxWidth: '640px' }}>
            Enterprise asynchronous delivery pipeline: Load Balancer, Redis Deduplication, Celery/SQS Task Queue,
            per-endpoint HMAC signing workers, and automatic retry backoff loops.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('diagram')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'diagram' ? '#1c3344' : '#0b141b',
              color: activeTab === 'diagram' ? '#38bdf8' : '#829ca9',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #1f3647'
            }}
          >
            <span>🏗️</span> Architecture Blueprint
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('endpoints')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'endpoints' ? '#1c3344' : '#0b141b',
              color: activeTab === 'endpoints' ? '#38bdf8' : '#829ca9',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #1f3647'
            }}
          >
            <span>🌐</span> Customer UI &amp; Endpoints ({endpoints.length})
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: ARCHITECTURE BLUEPRINT & INTERACTIVE PIPELINE TRACE     */}
      {/* ============================================================== */}
      {activeTab === 'diagram' && (
        <div>
          {/* Action Ribbon for Live Simulation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#0d171f',
              border: '1px solid #1e313d',
              borderRadius: '10px',
              padding: '12px 18px',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: isTracing ? '#fbbf24' : '#22c55e',
                  boxShadow: isTracing ? '0 0 10px #fbbf24' : '0 0 8px #22c55e'
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#edf4f5' }}>
                {isTracing
                  ? `Tracing Active: Stage ${activeStageIndex + 1}/${ARCHITECTURE_STAGES.length} executing...`
                  : 'Architecture Pipeline Ready'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="primary-button"
                disabled={isTracing}
                onClick={() => handleRunTrace(false)}
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontWeight: '800',
                  opacity: isTracing ? 0.6 : 1,
                  cursor: isTracing ? 'not-allowed' : 'pointer'
                }}
              >
                ⚡ Run Live Architecture Trace (200 OK)
              </button>

              <button
                type="button"
                className="secondary-button"
                disabled={isTracing}
                onClick={() => handleRunTrace(true)}
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#fbbf24',
                  borderColor: 'rgba(251, 191, 36, 0.4)',
                  opacity: isTracing ? 0.6 : 1,
                  cursor: isTracing ? 'not-allowed' : 'pointer'
                }}
              >
                🔄 Simulate Requeue &amp; Retry (503 Backoff)
              </button>
            </div>
          </div>

          {/* Blueprint Container (Styled to reflect the user's diagram) */}
          <div
            style={{
              background: 'linear-gradient(180deg, #09131a 0%, #060e13 100%)',
              border: '2px solid #1a3d54',
              borderRadius: '16px',
              padding: '24px',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
              marginBottom: '24px'
            }}
          >
            {/* VPC Header Badge */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '1px solid #142836',
                paddingBottom: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: 'rgba(249, 115, 22, 0.15)',
                    color: '#f97316',
                    border: '1px solid rgba(249, 115, 22, 0.4)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '800'
                  }}
                >
                  ☁️ VPC (Virtual Private Cloud)
                </span>
                <span style={{ fontSize: '11px', color: '#7e96a4' }}>
                  CIDR: 10.0.0.0/16 | Region: us-east-1 | Security Group: sg-brandguard-webhooks
                </span>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(56, 189, 248, 0.25)'
                }}
              >
                🔐 Encrypted (TLS 1.3 &amp; HMAC SHA-256)
              </span>
            </div>

            {/* Stages Grid (Sequential Flow matching diagram) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px',
                position: 'relative'
              }}
            >
              {ARCHITECTURE_STAGES.map((stage, idx) => {
                const isCurrentlyActive = activeStageIndex === idx
                const isPast = activeStageIndex !== null && activeStageIndex > idx

                return (
                  <div
                    key={stage.id}
                    style={{
                      background: isCurrentlyActive
                        ? 'linear-gradient(145deg, #163244 0%, #112635 100%)'
                        : '#0b161e',
                      border: isCurrentlyActive
                        ? '2px solid #38bdf8'
                        : isPast
                        ? '1px solid #22c55e'
                        : '1px solid #1a2c38',
                      borderRadius: '12px',
                      padding: '16px',
                      position: 'relative',
                      boxShadow: isCurrentlyActive
                        ? '0 0 20px rgba(56, 189, 248, 0.35)'
                        : 'none',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '170px'
                    }}
                  >
                    <div>
                      {/* Stage Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '18px' }}>{stage.icon}</span>
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: '800',
                              color: stage.tagColor,
                              textTransform: 'uppercase',
                              letterSpacing: '0.4px'
                            }}
                          >
                            Step {idx + 1}
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: isCurrentlyActive
                              ? 'rgba(56, 189, 248, 0.2)'
                              : isPast
                              ? 'rgba(34, 197, 94, 0.2)'
                              : '#12202a',
                            color: isCurrentlyActive ? '#38bdf8' : isPast ? '#22c55e' : '#728b97',
                            border: `1px solid ${isCurrentlyActive ? '#38bdf8' : isPast ? '#22c55e' : '#1e3342'}`
                          }}
                        >
                          {isCurrentlyActive ? 'RUNNING' : isPast ? 'VERIFIED' : stage.tag}
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '800', color: '#edf4f5' }}>
                        {stage.title}
                      </h4>
                      <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#7a92a1', lineHeight: 1.45 }}>
                        {stage.desc}
                      </p>
                    </div>

                    <div
                      style={{
                        paddingTop: '8px',
                        borderTop: '1px solid #14232e',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '10px'
                      }}
                    >
                      <span style={{ color: '#4a6777', fontWeight: '600' }}>Specification:</span>
                      <span style={{ color: '#90aab9', fontWeight: '700' }}>{stage.spec}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Architecture Footer Notes: Logging & Monitoring Subsystem */}
            <div
              style={{
                marginTop: '20px',
                padding: '12px 16px',
                background: '#0c1720',
                border: '1px solid #182b37',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>📊</span>
                <div>
                  <strong style={{ fontSize: '11px', color: '#edf4f5', display: 'block' }}>
                    Logging and Monitoring Subsystem
                  </strong>
                  <span style={{ fontSize: '10px', color: '#768f9e' }}>
                    Active telemetry across Webhook Service, Task Queue, Storage, Caching Layer &amp; Dispatch Workers.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', fontSize: '11px' }}>
                <div>
                  <span style={{ color: '#768f9e' }}>Avg Latency: </span>
                  <strong style={{ color: '#38bdf8' }}>38.4ms</strong>
                </div>
                <div>
                  <span style={{ color: '#768f9e' }}>Success Rate: </span>
                  <strong style={{ color: '#22c55e' }}>99.98%</strong>
                </div>
                <div>
                  <span style={{ color: '#768f9e' }}>Retry Success: </span>
                  <strong style={{ color: '#fbbf24' }}>100%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Live Execution Logs & Trace Result Console */}
          {traceLogs.length > 0 && (
            <div
              style={{
                background: '#081117',
                border: '1px solid #1f3647',
                borderRadius: '12px',
                padding: '18px',
                marginBottom: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                  <strong style={{ fontSize: '13px', color: '#edf4f5' }}>
                    Live Distributed Trace Log (Telemetry Console)
                  </strong>
                </div>

                {traceResult && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '3px 10px',
                      borderRadius: '4px',
                      background: traceResult.success ? 'rgba(34, 197, 94, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                      color: traceResult.success ? '#22c55e' : '#fbbf24',
                      border: `1px solid ${traceResult.success ? '#22c55e' : '#fbbf24'}`
                    }}
                  >
                    STATUS: {traceResult.status} ({traceResult.latency})
                  </span>
                )}
              </div>

              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  background: '#04090d',
                  borderRadius: '8px',
                  padding: '14px',
                  border: '1px solid #14232e',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                {traceLogs.map((log, lIdx) => (
                  <div key={lIdx} style={{ display: 'flex', gap: '12px', lineHeight: 1.5 }}>
                    <span style={{ color: '#4a6777', flexShrink: 0 }}>[{log.time}]</span>
                    <span
                      style={{
                        color:
                          log.status === 'DELIVERED' || log.status === 'PASSED'
                            ? '#22c55e'
                            : log.status === 'REQUEUED'
                            ? '#fbbf24'
                            : log.status === 'FAILED'
                            ? '#f43f5e'
                            : '#38bdf8',
                        fontWeight: '700',
                        minWidth: '130px',
                        flexShrink: 0
                      }}
                    >
                      {log.stage}:
                    </span>
                    <span style={{ color: '#b9d2e0' }}>{log.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CUSTOMER UI & DESTINATION ENDPOINTS (From Diagram)      */}
      {/* ============================================================== */}
      {activeTab === 'endpoints' && (
        <div>
          {/* Header & Add Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#0d171f',
              border: '1px solid #1e313d',
              borderRadius: '10px',
              padding: '14px 18px',
              marginBottom: '20px'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#edf4f5' }}>
                Customer UI: Outbound Webhook Endpoints
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#7a92a1' }}>
                Give visibility into delivery status and ability to add/remove endpoints. Requeue and retry failed webhook attempts.
              </p>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => setShowAddModal(true)}
              style={{ padding: '8px 16px', fontSize: '11px', fontWeight: '800' }}
            >
              ➕ Register New Destination Endpoint
            </button>
          </div>

          {/* Endpoints Table / Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {endpoints.map((ep) => (
              <div
                key={ep.id}
                style={{
                  background: '#0d171f',
                  border: '1px solid #1e313d',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#edf4f5' }}>
                      {ep.name}
                    </h4>

                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background:
                          ep.status === 'healthy'
                            ? 'rgba(34, 197, 94, 0.15)'
                            : 'rgba(251, 191, 36, 0.15)',
                        color: ep.status === 'healthy' ? '#22c55e' : '#fbbf24',
                        border: `1px solid ${ep.status === 'healthy' ? '#22c55e' : '#fbbf24'}`
                      }}
                    >
                      {ep.status === 'healthy' ? '● Healthy (200 OK)' : '▲ Requeuing (503)'}
                    </span>
                  </div>

                  {/* URL & Secret Key info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38bdf8' }}>
                      POST {ep.url}
                    </div>

                    <div style={{ fontSize: '10px', color: '#7a92a1' }}>
                      Signing Secret: <code style={{ color: '#baf57f', background: '#09131a', padding: '1px 5px', borderRadius: '3px' }}>{ep.secretKey}</code> (HMAC SHA-256 Per-Endpoint)
                    </div>

                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {ep.events.map((ev, evIdx) => (
                        <span
                          key={evIdx}
                          style={{
                            fontSize: '9px',
                            background: '#12232f',
                            color: '#89a8ba',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            border: '1px solid #1a3344'
                          }}
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Metrics & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '11px', textAlign: 'right' }}>
                    <div>
                      <span style={{ color: '#688392', display: 'block', fontSize: '10px' }}>Last Latency</span>
                      <strong style={{ color: '#edf4f5' }}>{ep.lastLatencyMs}ms</strong>
                    </div>
                    <div>
                      <span style={{ color: '#688392', display: 'block', fontSize: '10px' }}>Last Attempt</span>
                      <strong style={{ color: '#edf4f5' }}>{ep.lastAttempt}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#688392', display: 'block', fontSize: '10px' }}>Delivered</span>
                      <strong style={{ color: '#22c55e' }}>{ep.successCount || 0}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => handleTestDispatchEndpoint(ep)}
                      style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '700' }}
                    >
                      ⚡ Test Dispatch
                    </button>

                    {ep.status !== 'healthy' && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleRetryEndpoint(ep)}
                        style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#fbbf24', borderColor: '#fbbf24' }}
                      >
                        🔄 Requeue &amp; Retry
                      </button>
                    )}

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleDeleteEndpoint(ep.id)}
                      style={{ padding: '6px 10px', fontSize: '11px', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD CUSTOMER DESTINATION ENDPOINT                       */}
      {/* ============================================================== */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 12, 17, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              width: 'min(500px, 94vw)',
              background: '#0d171f',
              border: '1px solid #233b49',
              borderRadius: '16px',
              padding: '24px',
              color: '#edf4f5',
              boxShadow: '0 24px 80px rgba(0,0,0,0.85)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>
                Register Outbound Webhook Destination
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#829ca9', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEndpoint}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#8fa6b4', marginBottom: '4px' }}>
                  Endpoint Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Production Shopify Webhook"
                  value={newEndpointName}
                  onChange={(e) => setNewEndpointName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#081218',
                    border: '1px solid #1e3545',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#edf4f5',
                    fontSize: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#8fa6b4', marginBottom: '4px' }}>
                  Destination HTTPS URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://myservice.com/webhooks/brand-compliance"
                  value={newEndpointUrl}
                  onChange={(e) => setNewEndpointUrl(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#081218',
                    border: '1px solid #1e3545',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#edf4f5',
                    fontSize: '12px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#8fa6b4', marginBottom: '4px' }}>
                  Per-Endpoint HMAC Secret Key (Optional - auto-generated if blank)
                </label>
                <input
                  type="text"
                  placeholder="whsec_custom_secret_key"
                  value={newEndpointSecret}
                  onChange={(e) => setNewEndpointSecret(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#081218',
                    border: '1px solid #1e3545',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#edf4f5',
                    fontSize: '12px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '800' }}
                >
                  Save &amp; Activate Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
