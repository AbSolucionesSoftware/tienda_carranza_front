import React, { useCallback, useContext, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import Navegacion from '../../components/Navegacion/Navegacion';
/* import Categorias from '../Categorias/Categorias'; */
import FooterPage from '../../components/Footer/Footer';
import './layout.scss';
import { MenuContext } from '../../context/carritoContext';
import clienteAxios from '../../config/axios';
import jwt_decode from 'jwt-decode';
import ColorCustomizer from '../Colors/colores';
import { makeStyles } from '@material-ui/styles';

export default function LayoutBasic(props) {
	const { routes } = props;
	const { Content, Footer } = Layout;
	const token = localStorage.getItem('token');
	var decoded = { _id: '' };
	const { setDatosContx, setLoading, active, setColores, colores } = useContext(MenuContext);
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

	const useStyles = makeStyles({
		background: {
			backgroundColor: colores.bodyPage.background
		},
	});
	
	const classes = useStyles();

	return (
		<div className="body">
			<ColorCustomizer />
			<Layout>
				<div className="cuerpo bg-layout">
					<Layout>
						<Navegacion />
						{/* <Categorias /> */}
						<Content style={{ height: 'auto' }} className={"bg-layout " + classes.background}>
							<div className="site-layout-content flex">
								<LoadRoutes routes={routes} />
							</div>
						</Content>
					</Layout>
				</div>
				<Footer className="foot" style={{ margin: 0, padding: 0 }}>
					<FooterPage style={{ margin: 0, padding: 0 }} />
				</Footer>
			</Layout>
		</div>
	);
}

function LoadRoutes({ routes }) {
	return (
		<Switch>
			{routes.map((route, index) => (
				<Route key={index} path={route.path} exact={route.exact} component={route.component} />
			))}
		</Switch>
	);
}
