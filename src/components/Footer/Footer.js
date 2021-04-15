import React, { useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Button, Layout } from 'antd';
/* import aws from '../../config/aws'; */
import jwt_decode from 'jwt-decode';

import {
	FacebookFilled,
	InstagramFilled,
	TwitterCircleFilled,
	KeyOutlined,
	PhoneOutlined,
	SettingOutlined
} from '@ant-design/icons';
import './footer.scss';
import { MenuContext } from '../../context/carritoContext';
import { makeStyles } from '@material-ui/styles';
const { Footer } = Layout;

const token = localStorage.getItem('token');
var decoded = Jwt(token);

function Jwt(token) {
	try {
		return jwt_decode(token);
	} catch (e) {
		return null;
	}
}

const FooterPage = (props) => {
	const { datosContx, colores } = useContext(MenuContext);

	const useStyles = makeStyles({
		background: {
			backgroundColor: colores.footer.background,
			"& .text-color": {
				color: `${colores.footer.text}!important`
			}
		}
	});
	const classes = useStyles();

	if (!datosContx.navbar || !datosContx.navbar.filtroNav) {
		return null;
	}

	const categorias_foot = datosContx.navbar.filtroNav.map((categoria, index) => {
		if (index <= 14) {
			return (
				<Button type="link" className="footer-font-color text-color" key={categoria.categoria}>
					<Link className="font-cat-foot" to={`/filtros/null/${categoria.categoria}/null/null`}>
						{categoria.categoria}
					</Link>
				</Button>
			);
		}
	});

	return (
		<Layout className="layout">
			<Footer className={"bg-footer " + classes.background}>
				<div end="xs" id="foot">
					<div className="row footer-font-color">
						<div className="col-lg-4  d-sm-text-center">
							{/* {datosContx.tienda.length > 0 && datosContx.tienda[0].imagenLogo ? (
								<div className="contenedor-logo">
									<div className="logos">
										<img
											className="logotipo"
											alt="imagen de base"
											src={aws + datosContx.tienda[0].imagenLogo}
										/>
									</div>
								</div>
							) : null} */}
							{/* <h6>{tienda.nombre !== '' ? tienda.nombre : ""}</h6> */}
							{datosContx.tienda.length > 0 && datosContx.tienda[0].telefono ? (
								<div className="row mt-3">
									<PhoneOutlined
										className="mt-1 d-none d-lg-block text-color"
										style={{ fontSize: 55, marginLeft: 5 }}
									/>
									<div className="px-3 mt-2">
										<p className="font-foot text-color">¿Tienes preguntas? ¡Contáctanos!:</p>
										<h1 className="footer-font-color text-color" style={{ fontSize: 20 }}>
											{datosContx.tienda[0].telefono}
										</h1>
									</div>
								</div>
							) : (
								''
							)}

							<div className="mt-3 font-foot-normal">
								{datosContx.tienda.length > 0 && datosContx.tienda[0].direccion.length > 0 ? (
									<Fragment>
										<p style={{ fontWeight: 'bold' }} className="font-foot text-color">
											Datos de contacto:
										</p>
										<div>
											<p className="text-color">
												{datosContx.tienda[0].direccion[0].calle_numero}, Col.{' '}
												{datosContx.tienda[0].direccion[0].colonia},{' '}
											</p>
											<p className="text-color">
												{datosContx.tienda[0].direccion[0].ciudad},{' '}
												{datosContx.tienda[0].direccion[0].estado}
											</p>
										</div>
									</Fragment>
								) : (
									''
								)}

								<div className="mt-3">
									{datosContx.tienda.length > 0 && datosContx.tienda[0].linkFace !== '' ? (
										<a
											href={datosContx.tienda[0].linkFace}
											target="_blank"
											rel="noopener noreferrer"
										>
											<FacebookFilled id="is" style={{ fontSize: 33 }} className="text-color" />
										</a>
									) : null}
									{datosContx.tienda.length > 0 && datosContx.tienda[0].linkInsta !== '' ? (
										<a
											href={datosContx.tienda[0].linkInsta}
											target="_blank"
											rel="noopener noreferrer"
										>
											<InstagramFilled id="is" style={{ fontSize: 33 }} className="text-color" />
										</a>
									) : null}

									{datosContx.tienda.length > 0 && datosContx.tienda[0].linkTweeter !== '' ? (
										<a
											href={datosContx.tienda[0].linkTweeter}
											target="_blank"
											rel="noopener noreferrer"
										>
											<TwitterCircleFilled id="is" style={{ fontSize: 33 }} className="text-color" />
										</a>
									) : null}
								</div>
							</div>
						</div>
						{datosContx.tienda.length > 0 && datosContx.tienda[0].diasHorariosEmpresas ? (
							<div className="col-lg-3 mt-5 d-none d-lg-block">
								<div className="container">
									<p className="font-foot text-color">
										<span className="font-weight-bold">Horarios de Atención:</span>
										<p
											dangerouslySetInnerHTML={{
												__html: datosContx.tienda[0].diasHorariosEmpresas
											}}
										/>
									</p>
								</div>
							</div>
						) : null}
						<div className="col-lg-3 mt-lg-5 d-none d-lg-block">
							<p className="font-foot text-color" style={{ fontWeight: 'bold' }}>
								Encuéntralo más rápido
							</p>
							<div style={{ columnCount: 2 }}>
								<div>{categorias_foot}</div>
							</div>
						</div>
						<div className="col-lg-2 mt-5 d-none d-lg-block" style={{ columnCount: 1 }}>
							<p className="font-foot text-color" style={{ fontWeight: 'bold' }}>
								Atención al cliente
							</p>
							{/* {imagenCorp !== '' ? (
                                <Link  to="/quienes_somos" >
                                    <Button className="footer-font-color font-foot text-color" id="is" type="link" ><UserOutlined className="footer-font-color"/>
                                        Conócenos
                                    </Button>
                                </Link>
                            ): ""} */}

							{datosContx.tienda.length > 0 && datosContx.tienda[0].politicas ? (
								<HashLink to="/politicas#privacidad">
									<Button className="footer-font-color font-foot-normal text-color" id="is" type="link">
										<KeyOutlined className="footer-font-color text-color" />
										Aviso de Privacidad
									</Button>
								</HashLink>
							) : (
								''
							)}
							{datosContx.tienda.length > 0 && datosContx.tienda[0].politicasDescuentos ? (
								<HashLink to="/politicas#descuento">
									<Button className="footer-font-color font-foot-normal text-color" id="is" type="link">
										<KeyOutlined className="footer-font-color text-color" />
										Políticas de Descuento
									</Button>
								</HashLink>
							) : (
								''
							)}
							{datosContx.tienda.length > 0 && datosContx.tienda[0].politicasDevolucion ? (
								<HashLink to="/politicas#devolucion">
									<Button className="footer-font-color font-foot-normal text-color" id="is" type="link">
										<KeyOutlined className="footer-font-color text-color" />
										Políticas de Devolución
									</Button>
								</HashLink>
							) : (
								''
							)}
							{datosContx.tienda.length > 0 && datosContx.tienda[0].politicasVentas ? (
								<HashLink to="/politicas#ventas">
									<Button className="footer-font-color font-foot-normal text-color" id="is" type="link">
										<KeyOutlined className="footer-font-color text-color" />
										Políticas de Ventas
									</Button>
								</HashLink>
							) : (
								''
							)}
							{datosContx.tienda.length > 0 && datosContx.tienda[0].politicasEnvios ? (
								<HashLink to="/politicas#envios">
									<Button className="footer-font-color font-foot-normal text-color" id="is" type="link">
										<KeyOutlined className="footer-font-color text-color" />
										Políticas de Envíos
									</Button>
								</HashLink>
							) : (
								''
							)}

							{token && decoded['rol'] === false ? (
								<Link to="/perfiles">
									<Button className="footer-font-color font-foot-normal text-color" id="is" type="link">
										<SettingOutlined className="footer-font-color text-color" />
										Mi cuenta
									</Button>
								</Link>
							) : (
								<Link to="/entrar">
									<Button className="footer-font-color font-foot-normal text-color" id="is" type="link">
										<SettingOutlined className="footer-font-color text-color" />
										Mi cuenta
									</Button>
								</Link>
							)}
						</div>
					</div>
				</div>
				{/* <div className="align-center">
                    <p className="text-center">© CAFI - All Rights Reserved - 2020</p>
                </div> */}
			</Footer>
		</Layout>
	);
};

export default FooterPage;
