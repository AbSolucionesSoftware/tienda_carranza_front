import React, { useState, useEffect, useContext } from 'react';
import clienteAxios from '../../../config/axios';
import { notification, Result, Row } from 'antd';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import './Cards_Normales/card_producto.scss';
import Card_Producto from './Cards_Normales/card_producto';
import Spin from '../../../components/Spin';
import { MenuContext } from '../../../context/carritoContext';
import { makeStyles } from '@material-ui/styles';

function ConsultaProductos(props) {
	const { location, history } = props.propiedades;
	const { page = 1 } = queryString.parse(location.search);
	const [ productosPaginacion, setProductosPaginacion ] = useState([]);

	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const { colores } = useContext(MenuContext);

	useEffect(
		() => {
			if (window.screen.width < 768) {
				obtenerProductos(12, page);
			} else {
				obtenerProductos(40, page);
			}
		},
		[ page ]
	);

	async function obtenerProductos(limit, page) {
		setLoading(true);
		await clienteAxios
			.get(`/productos?limit=${limit}&page=${page}`)
			.then((res) => {
				setProductos(res.data.posts.docs);
				setProductosPaginacion(res.data.posts);
				setLoading(false);
			})
			.catch((err) => {
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
			});
	}

	const useStyles = makeStyles({
		background: {
			backgroundColor: colores.bodyPage.background
		},
		text: {
			color: colores.bodyPage.text
		}
	});
	const classes = useStyles();

	const render = productos.map((productos) => {
		return (<Card_Producto key={productos._id} productos={productos} />);
	});

	if (!productos) {
		return (
			<div className="w-100 d-flex justify-content-center align-items-center">
				<Result status="404" title="Aun no hay ofertas" />
			</div>
		);
	}

	return (
		<Spin spinning={loading}>
			<div className={"contenedor-home-background " + classes.background}>
				<div className="row float-left">
					<p className={"font-prin mb-0 text-center " + classes.text}>¡Conoce nuestro Menú!</p>
				</div>
			</div>
			<div className="d-flex justify-content-center align-items-center">
				<div className="">
					<Row gutter={10} style={{ maxWidth: '95vw' }} className=" mt-4">
						{render}
					</Row>
				</div>
			</div>
			<Pagination
				blogs={productosPaginacion}
				location={location}
				history={history}
				limite={window.screen.width < 768 ? 12 : 40}
			/>
		</Spin>
	);
}

export default ConsultaProductos;
