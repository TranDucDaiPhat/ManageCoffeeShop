const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const moment = require('moment'); // Thư viện giúp làm việc với thời gian

// Cấu hình port và middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Helper function để lọc sản phẩm theo thời gian
const filterByDateRange = (dateRange, data) => {
  const now = moment();
  let filteredData = [];

  switch (dateRange) {
    case '24h':
      filteredData = data.filter(item => moment(item.bill_creation_date).isAfter(now.subtract(24, 'hours')));
      break;
    case '7d':
      filteredData = data.filter(item => moment(item.bill_creation_date).isAfter(now.subtract(7, 'days')));
      break;
    case '14d':
      filteredData = data.filter(item => moment(item.bill_creation_date).isAfter(now.subtract(14, 'days')));
      break;
    case '1m':
      filteredData = data.filter(item => moment(item.bill_creation_date).isAfter(now.subtract(1, 'months')));
      break;
    case '3m':
      filteredData = data.filter(item => moment(item.bill_creation_date).isAfter(now.subtract(3, 'months')));
      break;
    default:
      filteredData = data;
      break;
  }

  return filteredData;
};

// API thống kê doanh số từng sản phẩm (đã bao gồm chức năng lọc theo thời gian)
server.get('/product-statistics', (req, res) => {
  const db = router.db; // Lowdb instance
  const billDetails = db.get('bill_detail').value();
  const products = db.get('products').value();
  const { timeFilter, minRevenue, maxRevenue, searchTerm } = req.query;

  // Lọc theo thời gian
  let filteredBillDetails = billDetails;
  if (timeFilter) {
    filteredBillDetails = filterByDateRange(timeFilter, billDetails);
  }

  const stats = products.map(product => {
    const filteredDetails = filteredBillDetails.filter(bd => bd.product_id === product.product_id);

    // Lọc theo doanh thu tối thiểu và tối đa
    const totalQuantity = filteredDetails.reduce((sum, item) => sum + item.product_quantity, 0);
    const totalRevenue = filteredDetails.reduce((sum, item) => sum + item.sub_total, 0);

    if (
      (minRevenue && totalRevenue < minRevenue) ||
      (maxRevenue && totalRevenue > maxRevenue) ||
      (searchTerm && !product.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return null;
    }

    return {
      product_id: product.product_id,
      product_name: product.product_name,
      totalQuantity,
      totalRevenue,
    };
  }).filter(Boolean);

  res.json(stats);
});

// API tìm kiếm sản phẩm theo tên
server.get('/products/search', (req, res) => {
  const db = router.db; // Lowdb instance
  const products = db.get('products').value();
  const searchTerm = req.query.name || '';

  const filteredProducts = products.filter(product => 
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  res.json(filteredProducts);
});

// API lọc sản phẩm theo doanh thu
server.get('/products/filter', (req, res) => {
  const db = router.db; // Lowdb instance
  const products = db.get('products').value();
  const minRevenue = parseFloat(req.query.minRevenue) || 0;
  const maxRevenue = parseFloat(req.query.maxRevenue) || Infinity;

  const filteredProducts = products.filter(product => {
    const totalRevenue = product.totalRevenue || 0; // Cần phải tính toán doanh thu tổng cho sản phẩm
    return totalRevenue >= minRevenue && totalRevenue <= maxRevenue;
  });

  res.json(filteredProducts);
});

server.use(router);
server.listen(3001, () => {
  console.log('JSON Server is running at http://localhost:3001');
});
