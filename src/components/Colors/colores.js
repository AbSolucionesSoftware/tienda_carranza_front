import React, { useContext, useState } from 'react';
import { Button, notification, Popover, Radio, Space } from 'antd';
import { FormatPainterOutlined } from '@ant-design/icons';
import { MenuContext } from '../../context/carritoContext';
import { SketchPicker } from 'react-color';
import { Fragment } from 'react';
import clienteAxios from '../../config/axios';
import jwt_decode from 'jwt-decode';
import './colores.scss';

export default function ColorCustomizer() {
	const token = localStorage.getItem('token');
	const { datosContx, colores, setColores } = useContext(MenuContext);
	const [ pickerVisible, setPickerVisible ] = useState(false);
	const [ colorPicker, setColorPicker ] = useState('#FFFFFF');
	const [ component, setComponent ] = useState('navBackground');
	const [ loading, setLoading ] = useState(false);

	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	const handleVisibleChange = () => setPickerVisible(!pickerVisible);
	const handlePickerChange = (color) => {
		setColorPicker(color.hex);
		/* Definimos los colores actuales para que se guarden si alguno otro cambia, los otros se quedaran como estan */
		let navPrimary = {
			text: colores.navPrimary.text,
			background: colores.navPrimary.background,
			hoverText: colores.navPrimary.hoverText
		};
		let navSecondary = {
			text: colores.navSecondary.text,
			background: colores.navSecondary.background,
			hoverText: colores.navSecondary.hoverText
		};
		let bodyPage = {
			text: colores.bodyPage.text,
			background: colores.bodyPage.background,
			hoverText: colores.bodyPage.hoverText,
			card: {
				text: colores.bodyPage.card.text,
				background: colores.bodyPage.card.background
			}
		};
		let footer = {
			text: colores.footer.text,
			background: colores.footer.background
		};
		/* Definimos el componente seleccionado y aplicamos colores en cada caso */
		switch (component) {
			/* NAVBAR PRINCIPAL */
			case 'navBackground':
				navPrimary = {
					text: colores.navPrimary.text,
					background: color.hex,
					hoverText: colores.navPrimary.hoverText
				};
				break;
			case 'navText':
				navPrimary = {
					text: color.hex,
					background: colores.navPrimary.background,
					hoverText: colores.navPrimary.hoverText
				};
				break;
			case 'navHover':
				navPrimary = {
					text: colores.navPrimary.text,
					background: colores.navPrimary.background,
					hoverText: color.hex
				};
				break;
			/* NAVBAR SECUNDARIO */
			case 'navSecBackground':
				navSecondary = {
					text: colores.navSecondary.text,
					background: color.hex,
					hoverText: colores.navSecondary.hoverText
				};
				break;
			case 'navSecText':
				navSecondary = {
					text: color.hex,
					background: colores.navSecondary.background,
					hoverText: colores.navSecondary.hoverText
				};
				break;
			case 'navSecHover':
				navSecondary = {
					text: colores.navSecondary.text,
					background: colores.navSecondary.background,
					hoverText: color.hex
				};
				break;
			/* CARDS */
			case 'bodyBackground':
				bodyPage = {
					text: colores.bodyPage.text,
					background: color.hex,
					hoverText: colores.bodyPage.hoverText,
					card: {
						text: colores.bodyPage.card.text,
						background: colores.bodyPage.card.background
					}
				};
				break;
			case 'bodyText':
				bodyPage = {
					text: color.hex,
					background: colores.bodyPage.background,
					hoverText: colores.bodyPage.hoverText,
					card: {
						text: colores.bodyPage.card.text,
						background: colores.bodyPage.card.background
					}
				};
				break;
			case 'bodyHover':
				bodyPage = {
					text: colores.bodyPage.text,
					background: colores.bodyPage.background,
					hoverText: color.hex,
					card: {
						text: colores.bodyPage.card.text,
						background: colores.bodyPage.card.background
					}
				};
				break;
			case 'cardBackground':
				bodyPage = {
					text: colores.bodyPage.text,
					background: colores.bodyPage.background,
					hoverText: colores.bodyPage.hoverText,
					card: {
						text: colores.bodyPage.card.text,
						background: color.hex
					}
				};
				break;
			case 'cardText':
				bodyPage = {
					text: colores.bodyPage.text,
					background: colores.bodyPage.background,
					hoverText: colores.bodyPage.hoverText,
					card: {
						text: color.hex,
						background: colores.bodyPage.card.background
					}
				};
				break;
			case 'footerText':
				footer = {
					text: color.hex,
					background: colores.footer.background
				};
				break;
			case 'footerBackground':
				footer = {
					text: colores.footer.text,
					background: color.hex
				};
				break;
		}
		setColores({
			navPrimary,
			navSecondary,
			bodyPage,
			footer
		});
	};
	const handleChangeComponent = (e) => {
		setComponent(e.target.value);
		switch (e.target.value) {
			/* NAVBAR PRINCIPAL */
			case 'navBackground':
				setColorPicker(colores.navPrimary.background);
				break;
			case 'navText':
				setColorPicker(colores.navPrimary.text);
				break;
			case 'navHover':
				setColorPicker(colores.navPrimary.hoverText);
				break;
			/* NAVBAR SECUNDARIO */
			case 'navSecBackground':
				setColorPicker(colores.navSecondary.background);
				break;
			case 'navSecText':
				setColorPicker(colores.navSecondary.text);
				break;
			case 'navSecHover':
				setColorPicker(colores.navSecondary.hoverText);
				break;
			/* CARDS */
			case 'bodyBackground':
				setColorPicker(colores.bodyPage.background);
				break;
			case 'bodyText':
				setColorPicker(colores.bodyPage.text);
				break;
			case 'bodyHover':
				setColorPicker(colores.bodyPage.hoverText);
				break;
			case 'cardBackground':
				setColorPicker(colores.bodyPage.card.background);
				break;
			case 'cardText':
				setColorPicker(colores.bodyPage.card.text);
				break;
			case 'footerText':
				setColorPicker(colores.footer.text);
				break;
			case 'footerBackground':
				setColorPicker(colores.footer.background);
				break;
		}
	};

	const resetColor = () => {
		setColores({
			navPrimary: {
				text: '#000000',
				background: '#FFFFFF',
				hoverText: '#e28000'
			},
			navSecondary: {
				text: '#000000',
				background: '#000000',
				hoverText: '#ffc340'
			},
			bodyPage: {
				text: '#000000',
				background: '#F5F5F5',
				hoverText: '#000000',
				card: {
					text: '#000000',
					background: '#ffffff'
				}
			},
			footer: {
				text: '#ffffff',
				background: '#3D3D3D'
			}
		});
	};

	const aplicarColores = async () => {
		setLoading(true);
		await clienteAxios
			.put(`/tienda/editar/colors/${datosContx.tienda[0]._id}`, colores, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				notification.success({
					message: 'Cambios realizados',
					duration: 2
				});
				handleVisibleChange();
			})
			.catch((res) => {
				console.log(res.response);
				setLoading(false);
				notification.error({
					message: 'Hubo un error',
					duration: 2
				});
			});
	};

	const styles = {
		float_button: {
			zIndex: 10,
			position: 'fixed',
			bottom: '16px',
			right: '16px'
		},
		button_size: {
			height: '70px',
			width: '70px'
		},
		icon_size: {
			fontSize: '30px'
		},
		radio_style: {
			display: 'block',
			height: '30px',
			lineHeight: '30px'
		}
	};

	if (!token) return null;
	if (token && decoded['rol'] === false) return null;

	const content_picker = (
		<div>
			<div className="row d-flex justify-content-around mb-2">
				<div className="col-md-3">
					<h6>Navegación</h6>
					<Radio.Group onChange={handleChangeComponent} value={component}>
						<Radio style={styles.radio_style} value="navBackground">
							Color fondo
						</Radio>
						<Radio style={styles.radio_style} value="navText">
							Color texto
						</Radio>
						<Radio style={styles.radio_style} value="navHover">
							Color activo
						</Radio>
					</Radio.Group>
				</div>
				{/* <div className="col-md-2">
					<h6>Categorias</h6>
					<Radio.Group onChange={handleChangeComponent} value={component}>
						<Radio style={styles.radio_style} value="navSecBackground">
							Color fondo
						</Radio>
						<Radio style={styles.radio_style} value="navSecText">
							Color texto
						</Radio>
						<Radio style={styles.radio_style} value="navSecHover">
							Color activo
						</Radio>
					</Radio.Group>
				</div> */}
				<div className="col-md-3">
					<h6>Fondo</h6>
					<Radio.Group onChange={handleChangeComponent} value={component}>
						<Radio style={styles.radio_style} value="bodyBackground">
							Color fondo
						</Radio>
						<Radio style={styles.radio_style} value="bodyText">
							Color texto
						</Radio>
						<Radio style={styles.radio_style} value="bodyHover">
							Color activo
						</Radio>
					</Radio.Group>
				</div>
				<div className="col-md-3">
					<h6>Productos</h6>
					<Radio.Group onChange={handleChangeComponent} value={component}>
						<Radio style={styles.radio_style} value="cardBackground">
							Color fondo
						</Radio>
						<Radio style={styles.radio_style} value="cardText">
							Color texto
						</Radio>
					</Radio.Group>
				</div>
				<div className="col-md-3">
					<h6>Footer</h6>
					<Radio.Group onChange={handleChangeComponent} value={component}>
						<Radio style={styles.radio_style} value="footerBackground">
							Color fondo
						</Radio>
						<Radio style={styles.radio_style} value="footerText">
							Color texto
						</Radio>
					</Radio.Group>
				</div>
			</div>
			<div className="row d-flex justify-content-around">
				<div className="col-md-5">
					<SketchPicker color={colorPicker} onChange={handlePickerChange} />
				</div>
				<div className="col-md-5">
					<div className="my-2 shadow" style={{ height: 100, backgroundColor: colorPicker }} />
					<Space direction="vertical" style={{ width: '100%' }}>
						<Button type="primary" onClick={aplicarColores} block loading={loading}>
							Guardar configuración
						</Button>
						<Button onClick={resetColor} block>
							Restablecer colores
						</Button>
					</Space>
				</div>
			</div>
		</div>
	);

	return (
		<Fragment>
			<div style={styles.float_button} className="hidden-sm">
				<Popover
					content={content_picker}
					title="Colores"
					trigger="click"
					visible={pickerVisible}
					onVisibleChange={() => handleVisibleChange()}
				>
					<Button
						type="primary"
						style={styles.button_size}
						shape="circle"
						icon={<FormatPainterOutlined style={styles.icon_size} />}
					/>
				</Popover>
			</div>
		</Fragment>
	);
}
