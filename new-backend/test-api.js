const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    // Test basic endpoint
    console.log('Testing basic endpoint...');
    const basicRes = await fetch(`${API_URL.replace('/api', '')}`);
    console.log('Basic endpoint status:', basicRes.status);
    
    // Test admin orders endpoint (should fail without auth)
    console.log('\nTesting admin orders endpoint without auth...');
    const ordersRes = await fetch(`${API_URL}/admin/orders`);
    console.log('Admin orders status:', ordersRes.status);
    
    console.log('\nAPI test completed. Check the output above for any errors.');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAPI(); 