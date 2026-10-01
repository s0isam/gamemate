const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: [] });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ success: true, data: { id: req.params.id } });
});

module.exports = router;
