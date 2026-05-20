import * as assert from 'assert';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5000';

let token: string | null = null;
let adminToken: string | null = null;

async function api(method: string, path: string, body?: any, auth?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${auth}`;
  
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err: any) {
      console.log(`  ✗ ${name}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n=== NeuronFlow API Tests ===\n');

  // Health
  await test('Health endpoint returns live', async () => {
    const { status, data } = await api('GET', '/health');
    assert.strictEqual(status, 200);
    assert.strictEqual(data.status, 'live');
  });

  // Register
  await test('Register new user', async () => {
    const email = `test_${Date.now()}@test.com`;
    const { status, data } = await api('POST', '/api/auth/register', {
      email,
      password: 'testpass123',
      name: 'Test User',
    });
    assert.strictEqual(status, 200);
    assert.ok(data.token);
    assert.strictEqual(data.user.email, email);
  });

  // Login
  await test('Login with valid credentials', async () => {
    const { status, data } = await api('POST', '/api/auth/login', {
      email: 'demo@neuronflow.com',
      password: 'demo1234',
    });
    assert.strictEqual(status, 200);
    assert.ok(data.token);
    token = data.token;
  });

  // Get me
  await test('Get current user profile', async () => {
    const { status, data } = await api('GET', '/api/auth/me', undefined, token!);
    assert.strictEqual(status, 200);
    assert.ok(data.email);
  });

  // Get agents (public)
  await test('Get all agents (public)', async () => {
    const { status, data } = await api('GET', '/api/agents');
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
  });

  // Get single agent
  await test('Get single agent by slug', async () => {
    const { status, data } = await api('GET', '/api/agents/lead-qualification');
    assert.strictEqual(status, 200);
    assert.ok(data.name);
    assert.ok(data.slug);
  });

  // Rate limiting
  await test('Rate limiting blocks after 5 attempts', async () => {
    for (let i = 0; i < 6; i++) {
      await api('POST', '/api/auth/login', {
        email: 'nonexistent@test.com',
        password: 'wrong',
      });
    }
    const { status } = await api('POST', '/api/auth/login', {
      email: 'nonexistent@test.com',
      password: 'wrong',
    });
    assert.strictEqual(status, 429);
  });

  // Unauthorized access
  await test('Unauthorized access returns 401', async () => {
    const { status } = await api('GET', '/api/auth/me');
    assert.strictEqual(status, 401);
  });

  // Payment order creation
  await test('Create payment order', async () => {
    const { status, data } = await api('POST', '/api/payments/order', { plan: 'starter' }, token!);
    assert.strictEqual(status, 200);
    assert.ok(data.order_id);
    assert.strictEqual(data.plan, 'starter');
  });

  // Get subscription (no active sub)
  await test('Get subscription returns null when no active sub', async () => {
    const { status, data } = await api('GET', '/api/payments/subscription', undefined, token!);
    assert.strictEqual(status, 200);
    assert.strictEqual(data, null);
  });

  // Leads CRUD
  await test('Create lead', async () => {
    const { status, data } = await api('POST', '/api/leads', {
      name: 'Test Lead',
      email: 'lead@test.com',
      company: 'Test Co',
    }, token!);
    assert.strictEqual(status, 201);
    assert.ok(data.id);
  });

  await test('Get leads', async () => {
    const { status, data } = await api('GET', '/api/leads', undefined, token!);
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(data));
  });

  // Audit submission (public)
  await test('Submit audit request', async () => {
    const { status, data } = await api('POST', '/api/audit', {
      name: 'Audit Test',
      email: 'audit@test.com',
      phone: '1234567890',
      company: 'Audit Co',
      industry: 'Tech',
    });
    assert.strictEqual(status, 201);
    assert.ok(data.id);
  });

  // LLM health check
  await test('LLM health check', async () => {
    const { status, data } = await api('GET', '/api/agent-tasks/llm-health');
    assert.strictEqual(status, 200);
    assert.ok(data.provider);
  });

  // Logout
  await test('Logout invalidates token', async () => {
    const { status } = await api('POST', '/api/auth/logout', undefined, token!);
    assert.strictEqual(status, 200);
    
    if (token) {
      const { status: afterStatus } = await api('GET', '/api/auth/me', undefined, token);
      assert.strictEqual(afterStatus, 401);
    }
  });

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
