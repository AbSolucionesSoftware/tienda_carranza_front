import React, {useCallback, useContext, useEffect, useState}  from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from './config/routes';
import { Helmet } from 'react-helmet';


import { MenuContext } from './context/carritoContext';
import clienteAxios from './config/axios';
import jwt_decode from 'jwt-decode';

import './scss/styleKryspi.scss';

export default function App() {

	const { setDatosContx, setLoading, active, setColores } = useContext(MenuContext);
	const [nombreTienda, setNombreTienda] = useState('');
	var decoded = { _id: '' };
	const token = localStorage.getItem('token');
	if (token !== null) decoded = Jwt(token);
	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	const obtenerInformacionTienda = useCallback(
		async () => {
			setLoading(true);
			await clienteAxios
				.get(`/home/${decoded._id ? decoded._id : null}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					const datos = res.data;
					setDatosContx(datos);
					// console.log(datos.tienda[0]);
					if(datos.tienda.length > 0){
						setNombreTienda(datos.tienda[0].nombre ? datos.tienda[0].nombre : 'Sin nombre');
					}
					setLoading(false);
					if (datos.tienda.length > 0 && datos.tienda[0].colorPage) {
						const colores = datos.tienda[0].colorPage;
						setColores({
							navPrimary: {
								text: colores.navPrimary.text,
								background: colores.navPrimary.background,
								hoverText: colores.navPrimary.hoverText,
							},
							navSecondary: {
								text: colores.navSecondary.text,
								background: colores.navSecondary.background,
								hoverText: colores.navSecondary.hoverText,
							},
							bodyPage: {
								text: colores.bodyPage.text,
								background: colores.bodyPage.background,
								hoverText: colores.bodyPage.hoverText,
								card: {
									text: colores.bodyPage.card.text,
									background: colores.bodyPage.card.background,
								}
							},
							footer: {
								text: colores.footer.text,
								background: colores.footer.background
							}
						});
					}
				})
				.catch((res) => {
					console.log(res);
					setLoading(false);
				});
		},
		[ decoded._id, token, setDatosContx, setLoading ]
	);

	useEffect(
		() => {
			obtenerInformacionTienda();
		},
		[ obtenerInformacionTienda, active ]
	);


	return (
		<div>
			<Helmet>
				<meta charSet="utf-8" />
				<title>{nombreTienda}</title>
			</Helmet>
				<Router>
					<Switch>{routes.map((route, index) => <RoutesWithSubRoutes key={index} {...route} />)}</Switch>
				</Router>
		</div>
	);
}

function RoutesWithSubRoutes(route) {
	return (
		<Route
			path={route.path}
			exact={route.exact}
			render={(props) => <route.component routes={route.routes} {...props} />}
		/>
	);
}
