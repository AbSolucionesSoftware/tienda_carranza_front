import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { notification, Modal, Select, Avatar, List, Button } from 'antd';
/* import { ShoppingCartOutlined, TagsOutlined, BellOutlined, WhatsAppOutlined } from '@ant-design/icons'; */
import aws from '../../../../config/aws';
import { formatoMexico } from '../../../../config/reuserFunction';
/* import DatosCliente from '../../Vista_Producto/subs/datos_cliente';
 */
const { Option } = Select;

export default function ApartadoCarrito(props) {
	const { cliente, token } = props;
	const [ visible, setVisible ] = props.modal;
	const [ producto, setProducto ] = useState([]);
	const [ apartadoMultiple, setApartadoMultiple ] = useState([]);
	const [ total, setTotal ] = useState(0);
	const [ tipoEnvio, setTipoEnvio ] = useState('REGOGIDO');

	const error = (err) => {
		if (err.response) {
			notification.error({
				message: 'Error',
				description: err.response.data.message,
				duration: 2
			});
		} else {
			notification.error({
				message: 'Error de conexion',
				description: 'Al parecer no se a podido conectar al servidor.',
				duration: 2
			});
		}
	};

	const obtenerCarrito = async () => {
		await clienteAxios
			.get(`/carrito/${cliente._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				const apartadoMultiple = [];
				const apartadoMultipleCompleto = [];
				const nuevo = res.data.articulos.map((res) => {
					if (res.idarticulo.activo === false) {
						return [];
					} else if (res.idarticulo.eliminado && res.idarticulo.eliminado === true) {
						return [];
					} else {
						return res;
					}
				});
				const carrito = nuevo.filter((arr) => arr.length !== 0);

				carrito.forEach((carrito) => {
					const medida = carrito.medida.map((res) => {
						if (res.talla) {
							return res.talla;
						} else if (res.numero) {
							return res.numero;
						}
						return null;
					});
					var precio;

					if (!carrito.promocion) {
						precio = carrito.idarticulo.precio;
					} else {
						precio = carrito.promocion.precioPromocion;
					}

					switch (carrito.idarticulo.tipoCategoria) {
						case 'Ropa':
							apartadoMultiple.push({
								producto: carrito.idarticulo._id,
								cantidad: carrito.cantidad,
								medida: { talla: medida[0] },
								precio: precio
							});
							apartadoMultipleCompleto.push({
								producto: carrito.idarticulo,
								cantidad: carrito.cantidad,
								medida: { talla: medida[0] },
								precio: precio
							});
							break;
						case 'Calzado':
							apartadoMultiple.push({
								producto: carrito.idarticulo._id,
								cantidad: carrito.cantidad,
								medida: { numero: medida[0] },
								precio: precio
							});
							apartadoMultipleCompleto.push({
								producto: carrito.idarticulo,
								cantidad: carrito.cantidad,
								medida: { numero: medida[0] },
								precio: precio
							});
							break;
						case 'Otros':
							apartadoMultiple.push({
								producto: carrito.idarticulo._id,
								cantidad: carrito.cantidad,
								precio: precio
							});
							apartadoMultipleCompleto.push({
								producto: carrito.idarticulo,
								cantidad: carrito.cantidad,
								precio: precio
							});
							break;
						default:
							break;
					}
				});

				var subtotal = 0;
				var total = 0;

				carrito.forEach((res) => {
					if (res.promocion) {
						subtotal += res.promocion.precioPromocion * res.cantidad;
					} else {
						subtotal += res.idarticulo.precio * res.cantidad;
					}
					total = subtotal;
				});

				setApartadoMultiple(apartadoMultiple);
				setProducto(apartadoMultipleCompleto);
				setTotal(total);
			})
			.catch((err) => {
				error(err);
			});
	};

	const apartarCarrito = async () => {
		await clienteAxios
			.post(
				'/apartado/multiple',
				{
					cliente: cliente._id,
					apartadoMultiple: apartadoMultiple,
					total: total,
					estado: 'PROCESANDO',
					tipoEntrega: tipoEnvio
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				notification.success({
					message: '¡Listo!',
					description: res.data.message,
					duration: 2
				});
				setTimeout(() => {
					window.location.href = '/pedidos';
				}, 1000);
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					return notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					return notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};

	const handleCancel = (e) => {
		setVisible(false);
	};

	function obtenerTipoEnvio(value) {
		setTipoEnvio(value);
	}

	const handleOk = () => {
		if (!tipoEnvio) {
			notification.info({
				message: 'Selecciona un tipo de envio',
				duration: 2
			});
		} else {
			setVisible(false);
			apartarCarrito();
		}
	};

	useEffect(
		() => {
			if (visible) {
				obtenerCarrito();
			}
		},
		[ visible ]
	);

	const articulos = producto.map((res, index) => {
		return (
			<List.Item key={index} className="row">
				<div className="col-lg-2">
					<Avatar size={64} src={aws + res.producto.imagen} />
				</div>
				<div className="col-lg-10">
					<h5>{res.producto.nombre}</h5>
					<div className="row">
						<div className="col-lg-3">
							<h6>Cantidad: {res.cantidad}</h6>
						</div>
						{res.medida ? (
							<div className="col-lg-3">
								{res.medida.numero ? (
									<h6>Talla: {res.medida.numero}</h6>
								) : (
									<h6>Talla: {res.medida.talla}</h6>
								)}
							</div>
						) : (
							<div className="d-none" />
						)}
						<div className="col-lg-3">
							<h6>Precio: ${formatoMexico(res.precio)}</h6>
						</div>
					</div>
				</div>
			</List.Item>
		);
	});

	return (
		<Modal
			style={{ top: 20 }}
			title="Ordenar para retirar en restaurant"
			visible={visible}
			onCancel={handleCancel}
			footer={null}
			width={700}
		>
			<List>{articulos}</List>
			<div className="d-flex">
				<h6 className="mr-2">Ordenado por:</h6>
				<p>
					<b>{cliente.nombre}</b>
				</p>
			</div>
			<div className="d-flex justify-content-end mt-3 border-bottom">
				<h4>Total: ${formatoMexico(total)}</h4>
			</div>
			<div className="d-flex justify-content-end align-items-center mt-1">
				<Button
					className="color-boton color-font-boton"
					size="large"
					style={{ width: 170 }}
					onClick={() => handleOk()}
				>
					Ordenar
				</Button>
			</div>
		</Modal>
	);
}
