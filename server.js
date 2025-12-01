const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Service URLs from environment variables
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:8080';
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:8080';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:8080';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:8080';

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'frontend' });
});

// Proxy to Order Service
app.use('/api/orders', createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    timeout: 60000,
    onError: (err, req, res) => {
        console.error('Order service proxy error:', err.message);
        res.status(502).json({ error: 'Order service unavailable', message: err.message });
    }
}));

// Proxy to Inventory Service
app.use('/api/inventory', createProxyMiddleware({
    target: INVENTORY_SERVICE_URL,
    changeOrigin: true,
    timeout: 60000,
    onError: (err, req, res) => {
        console.error('Inventory service proxy error:', err.message);
        res.status(502).json({ error: 'Inventory service unavailable', message: err.message });
    }
}));

// Proxy to Payment Service
app.use('/api/payments', createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true,
    timeout: 60000,
    onError: (err, req, res) => {
        console.error('Payment service proxy error:', err.message);
        res.status(502).json({ error: 'Payment service unavailable', message: err.message });
    }
}));

// Proxy to Notification Service
app.use('/api/notifications', createProxyMiddleware({
    target: NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    timeout: 60000,
    onError: (err, req, res) => {
        console.error('Notification service proxy error:', err.message);
        res.status(502).json({ error: 'Notification service unavailable', message: err.message });
    }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend server running on port ${PORT}`);
    console.log(`Order Service: ${ORDER_SERVICE_URL}`);
    console.log(`Inventory Service: ${INVENTORY_SERVICE_URL}`);
    console.log(`Payment Service: ${PAYMENT_SERVICE_URL}`);
    console.log(`Notification Service: ${NOTIFICATION_SERVICE_URL}`);
});
