import React, { useEffect, useState,  useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import './info-tienda.scss';
import Geolocalizacion from '../../../../pages/users/geolocalizacion';
import { withRouter } from 'react-router-dom';
import aws from '../../../../config/aws';
import Spin from '../../../../components/Spin';
import { MenuContext } from '../../../../context/carritoContext';

const InfoTienda = (props) => {
	const [ loading, setLoading ] = useState(false);
	const [ tienda, setTienda ] = useState([]);
	const { datosContx, colores } = useContext(MenuContext);

	useEffect(() => {
		obtenerTienda();
	}, []);

	async function obtenerTienda() {
		setLoading(true);
		await clienteAxios
			.get(`/tienda/`)
			.then((res) => {
				res.data.forEach((element) => setTienda(element));
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	}

	if (tienda.length === 0) {
		return null;
	}

	return (
		<Spin spinning={loading}>
			<div className="contenedor-info-tienda">
				<p className="titulos-vista-productos text-center font-secun">Encuentra nuestro restaurante</p>
				<div className="text-center">
					<div className="contenedor-imagen-info">
						<div className="contenedor-imagen-info-tienda">
							<img
								alt="logo-tienda"
								src={aws+tienda.imagenLogo}
								className="imagen-info-tienda"
							/>
						</div>
					</div>
					{/* <Avatar size={64} src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${tienda.imagenLogo}`} /> */}
					<div className="text-center">
						<p className="font-weight-bold font-prin" >
							{tienda.nombre}
						</p>
					</div>
				</div>
				{tienda.length !== 0 ? (
					tienda.direccion.map((direccion) => {
						return (
							<div key={direccion._id} className="container">
								<p className="font-descrip">
									<span className="font-weight-bold">Dirección:</span> {direccion.calle_numero}, Col.{' '}
									{direccion.colonia}, {direccion.ciudad}, {direccion.cp}
								</p>
								<p className="font-descrip">
									<span className="font-weight-bold">Teléfono:</span> {tienda.telefono}
								</p>
							</div>
						);
					})
				) : (
					<p />
				)}
				{datosContx.tienda?.length > 0 && datosContx.tienda[0].horario.length > 0 ? (
							<div className="mt-4">
								<div className="container">
									<p className="font-foot text-color">
										<span className="font-weight-bold">Horarios de Atención:</span>
									</p>
									{datosContx.tienda[0].horario.map((horario) => {
										if(horario.close){
											return (
												<div>
													<p className="h6">
														<b>{horario.dia}: </b> {horario.horarioInicial} -{' '}
														{horario.horarioFinal}
													</p>
												</div>
											);
										}else{
											return (
												<div>
													<p className="h6">
														<b>{horario.dia}: NO HAY SERVICIO </b>
													</p>
												</div>
											);
										}
									})}
								</div>
							</div>
						) : null}

				{/* {tienda.length !== 0 ? (
					tienda.ubicacion.map((ubicacion) => {
						return (
							<div key={ubicacion._id}>
								<Geolocalizacion
									height="50vh"
									width="100%"
									center={[ ubicacion.lat, ubicacion.lng ]}
									titleLayer={'map'}
									zoom={16}
									apikey="I0G4Jr6RUg71dsHIRF0qGzn0l39bAY1V"
									nombreMarcador="AB soluciones Empresariales"
									tituloheader={false}
									draggable={false}
								/>
							</div>
						);
					})
				) : (
					<p />
				)} */}
			</div>
		</Spin>
	);
};

export default withRouter(InfoTienda);
