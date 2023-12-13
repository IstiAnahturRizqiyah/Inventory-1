const pool = require('../models/database.js');

// Fungsi untuk ambil data dari database PostgreSQL
const fetchDataProducts = async () => {
  const connection = await pool.connect();
  const query = `SELECT * FROM product`;
  const results = await connection.query(query);
  connection.release();
  const products = results.rows;
  return products;
};

const fetchProductById = async (id_paket) => {
  const connection = await pool.connect();
  const query = 'SELECT * FROM product WHERE id_paket = $1';
  const result = await connection.query(query, [id_paket]);
  connection.release();
  return result.rows[0];
};

// Add new Customer
const addDataProduct = async (id_paket, paket_bunga, jmlh_stok, harga) => {
  const connection = await pool.connect();

  const query = 'INSERT INTO product (id_paket, paket_bunga, jmlh_stok, harga) VALUES ($1, $2, $3, $4) RETURNING *';

  const values = [id_paket, paket_bunga, jmlh_stok, harga];

  const result = await connection.query(query, values);

  connection.release();

  return result.rows[0];
};

// Fungsi untuk Cek ID  data_customer
const checkIdProduct = async (id_paket) => {
  const connection = await pool.connect();

  try {
    // Mengecek apakah id_customer sudah terdaftar
    const duplicateCheck = await connection.query('SELECT COUNT(*) FROM product WHERE id_paket = $1', [id_paket]);

    if (duplicateCheck.rows[0].count === 0) {
      // Jika tidak ada duplikat, mengembalikan null
      return null;
    }

    // Mengambil data pegawai berdasarkan id_customer
    const result = await connection.query('SELECT * FROM product WHERE id_paket = $1', [id_paket]);

    // Mengembalikan data data_customer
    return result.rows[0];
  } finally {
    connection.release();
  }
};

// duplicate Id check
const duplicateIdProductCheck = async (id_paket) => {
  const products = await fetchDataProducts();
  return products.find((data_product) => data_product.id_paket === id_paket);
};

// duplicate Name check
const duplicateProductName = async (paket_bunga) => {
  const products = await fetchDataProducts();
  return products.find((data_product) => data_product.paket_bunga === paket_bunga);
};

// update contact
const updateProduct = async (newContact) => {
  const connection = await pool.connect();
  const query = `
    UPDATE product
    SET paket_bunga = $2, jmlh_stok = $3, harga = $4
    WHERE id_paket = $1
  `;
  return await connection.query(query, [newContact.id_paket, newContact.paket_bunga, newContact.jmlh_stok, newContact.harga]);
};

// Delete-customer
const deleteDataProduct = async (id_paket) => {
  const connection = await pool.connect();
  try {
    const query = 'DELETE FROM product WHERE id_paket = $1 RETURNING *';

    const result = await connection.query(query, [id_paket]);

    return result.rows[0]; // Mengembalikan baris yang dihapus
  } finally {
    connection.release();
  }
};

// Cari contact
const searchProduct = async (id_paket) => {
  const products = await fetchDataProducts();
  const product = products.find((data_product) => data_product.id_paket.toLowerCase() === id_paket.toLowerCase());
  return product;
};

module.exports = {
  fetchDataProducts,
  addDataProduct,
  deleteDataProduct,
  fetchProductById,
  checkIdProduct,
  duplicateIdProductCheck,
  searchProduct,
  updateProduct,
  duplicateProductName,
};
