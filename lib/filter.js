'use strict'

module.exports.getFilter = req => {
  const nombre = req.query.nombre
    ? { nombre: new RegExp(`^${req.query.nombre}`, 'i') }
    : {}
  const tags = req.query.tags
    ? { tags: { $all: req.query.tags.split(',') } }
    : {}
  const venta = req.query.venta ? { venta: req.query.venta === 'true' } : {}
  let precioMin, precioMax, precio
  if (req.query.precio) {
    if (req.query.precio.includes('-')) {
      [precioMin, precioMax] = req.query.precio.split('-')
      precioMin = precioMin ? { $gte: parseFloat(precioMin) } : null
      precioMax = precioMax ? { $lte: parseFloat(precioMax) } : null
      precio = { precio: Object.assign({}, precioMin, precioMax) }
    } else {
      precio = { precio: parseFloat(req.query.precio) }
    }
  }
  return Object.assign({}, nombre, tags, venta, precio)
}
