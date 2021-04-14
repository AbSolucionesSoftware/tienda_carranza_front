import React, { useState, useContext } from 'react';
import { Layout, Menu, Button, Input, Drawer, Badge, Avatar, Spin } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import './navegacion.scss';
import 'firebase/auth';
import 'firebase/firestore';
import {
	SearchOutlined,
	MenuOutlined,
	ShoppingOutlined,
	SettingOutlined,
	LogoutOutlined,
	UserOutlined
} from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import RightMenu from './RightMenu';
import { MenuContext } from '../../context/carritoContext';
import aws from '../../config/aws';
import Categorias from '../../components/Categorias/Categorias';
import { Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';

const { Search } = Input;
const { Header } = Layout;
const { SubMenu } = Menu;

const Navegacion = (props) => {
	const { loading, datosContx, colores } = useContext(MenuContext);
	const [ visible, setVisible ] = useState(false);
	const [ busqueda, setBusqueda ] = useState('');
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	const showDrawer = () => setVisible(true);
	const onClose = () => setVisible(false);

	function valor(e) {
		setBusqueda(e.target.value);
	}

	const useStyles = makeStyles({
		background: {
			backgroundColor: colores.navPrimary.background,
			color: colores.navPrimary.text,
			'& .ant-menu-item-selected': {
				color: `${colores.navPrimary.hoverText}!important`,
				borderBottom: `none!important`,
				/* borderBottom: ` 3px solid ${colores.navPrimary.hoverText}!important` */
			}
		},
		hover: {
			'&:hover': {
				color: `${colores.navPrimary.hoverText}!important`,
				borderBottom: `none!important`,
				/* borderBottom: ` 3px solid ${colores.navPrimary.hoverText}!important` */
			}
		}, 
		navSecondary: {
			backgroundColor: colores.navSecondary.background
		}
	});
	const classes = useStyles();

	if (loading) {
		return (
			<div className="preloading">
				<div className="contenedor-preloading">
					<Spin size="large" tip="Cargando la tienda..." className="spiner" />
				</div>
			</div>
		);
	}

	return (
		<div>
			<Layout className="layout navbar-menu-general a00">
				<Header className=" a1">
					<div className="menuCon a2">
						<div className="top-menu row a3 container-prin">
							<div className={'col-lg-12 container-pages a4 ' + classes.background}>
								<Menu
									className={'navbar-menu-sesion float-right nav-font-pages a5 ' + classes.background}
									mode="horizontal"
									defaultSelectedKeys={[ window.location.pathname ]}
									inlineindent={0}
								>
									<Menu.Item
										className={'nav-font-color nav-border-color font-nav-sec a6 ' + classes.hover}
										key="/blog"
									>
										<div className="centrar-nav">Blog</div>
										<Link to="/blog" />
									</Menu.Item>
									{datosContx.tienda && datosContx.tienda.length > 0 ? (
										<Menu.Item
											className={
												'nav-font-color nav-border-color font-nav-sec a6 ' + classes.hover
											}
											key="/quienes_somos"
										>
											<div className="centrar-nav">Quiénes somos</div>
											<Link to="/quienes_somos" />
										</Menu.Item>
									) : (
										<Menu.Item className="d-none" />
									)}
								</Menu>
							</div>
						</div>
					</div>
				</Header>
			</Layout>
			{/* DIVISOR PARA EL INPUT  */}

			<Layout className="layout  a0">
				<Header className={'a1 ' + classes.background}>
					<div className="menuCon a2">
						<div className="top-menu row a3">
							<div className="col-lg-5">
								<Categorias />
							</div>
							<div className="col-lg-2 row-logo-search">
								<div className="row row-logo-search-2 ">
									{datosContx.tienda && datosContx.tienda.length > 0 ? !datosContx.tienda[0]
										.imagenLogo ? (
										<div className="d-none" />
									) : (
										<div className="col-lg-3">
											<Link to="/">
												<div className="contenedor-logo">
													<img
														className="imagen-logo-principal"
														alt="logotipo-tienda"
														src={aws + datosContx.tienda[0].imagenLogo}
													/>
												</div>
											</Link>
										</div>
									) : (
										<div className="d-none" />
									)}
								</div>
							</div>

							{/* INICIO DE AVATAR, TU CARRITO Y ENTRAR  */}
							<div className="col-lg-5 row a4 containe-categorias d-flex justify-content-end">
								<Menu
									className={'float-right navbar-menu-sesion a50 ' + classes.background}
									/* theme="light" */
									mode="horizontal"
									defaultSelectedKeys={[ window.location.pathname ]}
									inlineindent={0}
								>
									{/* COSAS IRRELEVANTES */}
									<Menu.Item
										className={'nav-font-color nav-border-color font-nav a6 ' + classes.hover}
										key="/"
									>
										<div className="centrar-nav">Inicio</div>
										<Link to="/" />
									</Menu.Item>
									<Menu.Item
										className={'nav-font-color nav-border-color font-nav a6 ' + classes.hover}
										key="/productos"
									>
										<div className="centrar-nav">Productos</div>
										<Link to="/productos" />
									</Menu.Item>
									{datosContx.ofertas ? (
										<Menu.Item
											className={'nav-font-color nav-border-color font-nav a6 ' + classes.hover}
											key="/ofertas"
										>
											<div className="centrar-nav">Ofertas</div>
											<Link to="/ofertas" />
										</Menu.Item>
									) : (
										<Menu.Item className="d-none" />
									)}

									{/* INICIO DE CARRITO */}
									{!decoded || decoded.rol === true ? (
										<Menu.Item key="" className="d-none" />
									) : (
										<Menu.Item
											className='nav-font-color-sesion a6'
											key="/shopping_cart"
										>
											<div className="centrar-nav">
												<Badge count={datosContx.carritoCantidad}>
													<ShoppingOutlined style={{ fontSize: 25 }} className={classes.background} />
													<Link to="/shopping_cart" />
												</Badge>
											</div>
										</Menu.Item>
									)}
									{token && decoded['rol'] === false ? (
										<SubMenu
											className="nav-font-color-sesion a6"
											icon={
												!decoded.imagen && !decoded.imagenFireBase ? (
													<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
														<p>{decoded.nombre.charAt(0)}</p>
													</Avatar>
												) : decoded.imagenFireBase ? (
													<Avatar size="large" src={decoded.imagenFireBase} />
												) : (
													<Avatar size="large" src={aws + decoded.imagen} />
												)
											}
										>
											{!decoded || decoded.rol === true ? (
												<Menu.Item key="" className="d-none" />
											) : (
												<Menu.Item className="nav-font-color-sesion a6 font-nav" key="/pedidos">
													<ShoppingOutlined />Mis compras
													<Link to="/pedidos" />
												</Menu.Item>
											)}
											<Menu.Item key="" className="nav-font-color-sesion font-nav">
												<SettingOutlined />Mi cuenta<Link to="/perfiles" />
											</Menu.Item>
											<Menu.Item>
												<div
													className="text-danger centrar-nav font-nav"
													onClick={() => {
														localStorage.removeItem('token');
														firebase.auth().signOut();
														setTimeout(() => {
															window.location.reload();
														}, 1000);
													}}
												>
													<LogoutOutlined />Cerrar Sesión
												</div>
											</Menu.Item>
										</SubMenu>
									) : decoded && decoded['rol'] === true ? (
										<Fragment>
											<SubMenu
												className="nav-font-color nav-border-color a6"
												icon={
													!decoded.imagen ? (
														<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
															<p>{decoded.nombre.charAt(0)}</p>
														</Avatar>
													) : (
														<Avatar size="large" src={aws + decoded.imagen}>
															{/* <p>{decoded.nombre.charAt(0)}</p> */}
														</Avatar>
													)
												}
											>
												<Menu.Item key="" className="font-nav a6">
													<SettingOutlined />Panel de administrador<Link to="/admin" />
												</Menu.Item>
												<Menu.Item key="" className=" a6">
													<div
														className="text-danger centrar-nav font-nav"
														onClick={() => {
															localStorage.removeItem('token');
															firebase.auth().signOut();
															setTimeout(() => {
																window.location.reload();
															}, 1000);
														}}
													>
														<LogoutOutlined />Cerrar Sesión
													</div>
												</Menu.Item>
											</SubMenu>
										</Fragment>
									) : (
										<Menu.Item key="" className="d-none" />
									)}
									{token === '' || token === null ? (
										<Menu.Item key="" className="nav-font-color-sesion nav-border-color a6">
											<div className="centrar-nav">
												<UserOutlined style={{ fontSize: 27 }} />
											</div>
											<Link to="/entrar" />
										</Menu.Item>
									) : (
										<Menu.Item key="" className="d-none" />
									)}
								</Menu>
							</div>
							{/* FIN DE AVATAR, TU CARRITO Y ENTRAR  */}
						</div>
						<div className="top-menu-responsive">
							<Button type="link" className="barsMenu" onClick={showDrawer}>
								<MenuOutlined className={"menu-responsivo-icon " + classes.background} style={{ fontSize: 22 }} />
							</Button>
							<Search
								className="search-nav-responsive"
								placeholder="input search text"
								onSearch={(value) => props.history.push(`/searching/${value}`)}
							/>
							{!decoded || decoded.rol === true ? (
								<div className="d-none" />
							) : (
								<div className="mx-4">
									<Badge count={datosContx.carritoCantidad}>
										<Link to="/shopping_cart">
											<ShoppingOutlined
												className={"menu-responsivo-icon " + classes.background}
												style={{ fontSize: 28 }}
											/>
										</Link>
									</Badge>
								</div>
							)}
						</div>
						<Drawer
							className="drawer-background"
							title={
								datosContx.tienda && datosContx.tienda.length > 0 ? !datosContx.tienda[0].imagenLogo ? (
									<div className="d-none" />
								) : (
									<div className="contenedor-logo">
										<Link to="/">
											<img
												className="imagen-logo-principal"
												alt="logotipo-tienda"
												src={aws + datosContx.tienda[0].imagenLogo}
											/>
										</Link>
									</div>
								) : (
									<div className="d-none" />
								)
							}
							placement="left"
							closable={false}
							onClose={onClose}
							visible={visible}
						>
							<RightMenu ofertas={datosContx.ofertas} tienda={datosContx.tienda} />
						</Drawer>
					</div>
				</Header>
			</Layout>

			<div className="d-none d-lg-block ">
				<Layout className="layout a01 ">
					<Header className={"fondo-search a1 " + classes.navSecondary}>
						<div className="menuCon a2">
							<div className="top-menu row a3 ">
								<div className="col-lg-12 a4 containe-categorias">
									<div className="row input-search d-flex justify-content-center">
										<Input onChange={valor} className="input-search border-color-search-input" />

										<Button
											onClick={(value) => props.history.push(`/searching/${busqueda}`)}
											className="boton-search border-color-search-boton"
										>
											<SearchOutlined style={{ fontSize: 25 }} />
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Header>
				</Layout>
			</div>
		</div>
	);
};

export default withRouter(Navegacion);
