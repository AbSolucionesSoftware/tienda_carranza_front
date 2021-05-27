import React, { useState, useContext } from 'react';
import { Layout, Menu, Button, Input, Drawer, Badge, Avatar, Spin } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import './navegacion.scss';
import 'firebase/auth';
import 'firebase/firestore';
import { MenuOutlined, ShoppingOutlined, SettingOutlined, LogoutOutlined, UserOutlined, CloseCircleOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import RightMenu from './RightMenu';
import { MenuContext } from '../../context/carritoContext';
import aws from '../../config/aws';
import './navegacion.scss';
import Categorias from '../../components/Categorias/Categorias';
import { makeStyles } from '@material-ui/styles';
import NavegacionResponsive from './NavegacionResponsive';

const { Search } = Input;
const { Header } = Layout;
const { SubMenu } = Menu;

const Navegacion = (props) => {
	const { loading, datosContx, colores, setUpload, upload } = useContext(MenuContext);
	const [ visible, setVisible ] = useState(false);
	const [openSearch, setOpenSearch] = useState(false);
	/* const [ busqueda, setBusqueda] = useState("") */
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
	/* const valor = (e) => setBusqueda(e.target.value); */
	const openBusqueda = () => {
		setOpenSearch(!openSearch);
	}
	const useStyles = makeStyles({
		background: {
			backgroundColor: colores.navPrimary.background,
			color: colores.navPrimary.text,
			'& .ant-menu-item-selected': {
				color: `${colores.navPrimary.hoverText}!important`,
				/* borderBottom: `none!important` */
				borderBottom: ` 3px solid ${colores.navPrimary.hoverText}!important`
			}
		},
		hover: {
			'&:hover': {
				color: `${colores.navPrimary.hoverText}!important`,
				/* borderBottom: `none!important` */
				borderBottom: ` 3px solid ${colores.navPrimary.hoverText}!important`
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
					<Spin size="large" tip="Cargando..." className="spiner" />
				</div>
			</div>
		);
	}

	return (
		<div>
			<Layout className="layout navbar-menu-general a00">
				<Header className=" a1">
					<div className={"menuCon a2 " + classes.background }>
						<div className="top-menu row a3 container-prin">
							<div className={"col-lg-12 container-pages a4 " + classes.background }>
								<Menu
									className={"navbar-menu-sesion float-right nav-font-pages a5 " + classes.background}
									/* theme="light" */
									mode="horizontal"
									defaultSelectedKeys={[ window.location.pathname ]}
									inlineindent={0}
								>
									<Menu.Item className={"nav-font-color nav-border-color font-foot-normal a6 " + classes.background + " " + classes.hover} key="/">
										<div className="centrar-nav">Inicio</div>
										<Link to="/" />
									</Menu.Item>
									<Menu.Item
										className={"nav-font-color nav-border-color font-foot-normal a6 " + classes.background + " " + classes.hover}
										key="/productos"
									>
										<div className="centrar-nav">Menú</div>
										<Link to="/productos" />
									</Menu.Item>
									{datosContx.ofertas ? (
										<Menu.Item
											className={"nav-font-color nav-border-color font-foot-normal a6 " + classes.background + " " + classes.hover}
											key="/ofertas"
										>
											<div className="centrar-nav">Ofertas</div>
											<Link to="/ofertas" />
										</Menu.Item>
									) : (
										<Menu.Item className="d-none" />
									)}
									{/* <Menu.Item className="nav-font-color nav-border-color a6" key="/blog">
									<div className="centrar-nav" >Blog</div>
									<Link to="/blog" />
								</Menu.Item>
								{tienda.length === 0 ? (
									<Menu.Item className="d-none" />
								) : (
									<Menu.Item className="nav-font-color nav-border-color a6" key="/quienes_somos">
										<div className="centrar-nav" >Quiénes somos</div>
										<Link to="/quienes_somos" />
									</Menu.Item>
								)} */}
								</Menu>
							</div>
						</div>
					</div>
				</Header>
			</Layout>

			{/* DIVISOR PARA EL INPUT  */}

			<Layout className={"layout a0 " + classes.background } >
				<Header className={" a1 "+ classes.background }>
					<div className={"menuCon a2 " + classes.background }>
						<div className={"top-menu row a3 " + classes.background }>
							<div className="col-lg-2 row-logo-search">
								<div className="row row-logo-search-2 ">
									{datosContx.tienda && datosContx.tienda.length > 0 ? !datosContx.tienda[0]
										.imagenLogo ? (
										<div className="d-none" />
									) : (
										<Link to="/">
											<div className="text-center contenedor-logo">
												<img
													className="imagen-logo-principal"
													alt="logotipo-tienda"
													src={aws + datosContx.tienda[0].imagenLogo}
												/>
											</div>
										</Link>
									) : (
										<div className="d-none" />
									)}
									{/* <div className="col-lg-8 row input-search">
									<Input
										onChange={valor}
										className="input-search border-color-search-input"
									/>
									
									<Button
										onClick={(value) => props.history.push(`/searching/${busqueda}`)}
										className="boton-search border-color-search-boton"
									>
										<SearchOutlined style={{fontSize: 25}}/>
									</Button>
								</div> */}
								</div>
							</div>
							{/* INICIO DE AVATAR, TU CARRITO Y ENTRAR  */}
							<div className="col-lg-8 containe-categorias mt-2">
								<Categorias />
							</div>
							<div className="col-lg-2 row a4 mt-2 justify-content-end">
								<div>
									<Menu
										className={"float-right navbar-menu-sesion a50 "  + classes.background}
										/* theme="light" */
										mode="horizontal"
										defaultSelectedKeys={[ window.location.pathname ]}
										inlineindent={0}
									>
										{!decoded || decoded.rol === true ? (
											<Menu.Item key="" className="d-none" />
										) : (
											<Menu.Item
												className={"nav-font-color-sesion font-foot-normal a6 " + classes.background + ' ' + classes.hover}
												key="/shopping_cart"
											>
												<div className="centrar-nav">
													<Badge count={datosContx.carritoCantidad}>
														<ShoppingOutlined style={{ fontSize: 26 }} className={classes.background + ' ' + classes.hover} />
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
													<Menu.Item
														className="nav-font-color-sesion a6 font-foot-normal"
														key="/pedidos"
													>
														<ShoppingOutlined /> Mis ordenes
														<Link to="/pedidos" />
													</Menu.Item>
												)}
												<Menu.Item key="" className="nav-font-color-sesion font-foot-normal">
													<SettingOutlined />Mi cuenta<Link to="/perfiles" />
												</Menu.Item>
												<Menu.Item>
													<div
														className="text-danger centrar-nav font-foot-normal"
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
												<Menu.Item key="" className="font-foot-normal a6">
													<SettingOutlined />Panel de administrador<Link to="/admin" />
												</Menu.Item>
												<Menu.Item key="" className=" a6">
													<div
														className="text-danger centrar-nav font-foot-normal"
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
							</div>
							{/* FIN DE AVATAR, TU CARRITO Y ENTRAR  */}
						</div>

						<NavegacionResponsive setOpenSearch={setOpenSearch} openSearch={openSearch}/>
						
					</div>
				</Header>
			</Layout>

			<Layout className="layout top-menu-responsive">
				<Header className={'a1 ' + classes.background}>
					<div className="d-flex justify-content-center">
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
						</Menu>
					</div>
				</Header>
			</Layout>
			{/* PARA PODER MOSTRAR EL BUSCADOR DE LA PAGINA */}
			{
				openSearch === true ? (
					<Layout className="layout">
						<Header className={'a1 ' + classes.background}>
							<div className="row">
								<div className="col-10 mb-1 ml-2 mt-1">
									<Search
										className="search-nav-responsive"
										placeholder="Busca tus productos"
										style={{borderRadius: 25}}
										onSearch={(value) => props.history.push(`/searching/${value}`)}
									/>
									
								</div>
								<div className="col-1 d-flex flex-row-reverse justify-content-center flex-wrap align-content-center">
									<CloseCircleOutlined 
										style={{fontSize: 23}}
										onClick={() => setOpenSearch(!openSearch)}
									/>
								</div>
								
							</div>
						</Header>
					</Layout>
				) : null
			}
			{/* TERMINA PODER MOSTRAR EL BUSCADOR DE LA PAGINA */}

			{/* <Layout className="layout navbar-menu-general a00">
			<Header className="navbar-menu-general a1">
				<div className="menuCon navbar-menu-general a2">
					<div className="top-menu row a3 container-prin">
						<div className="col-lg-12 containe-categorias">
							<Categorias />
						</div>
					</div>
				</div>
			</Header>
		</Layout> */}
		</div>
	);
};

export default withRouter(Navegacion);
