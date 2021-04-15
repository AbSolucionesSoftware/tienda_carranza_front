  import React, { useContext } from 'react';
import aws from '../../../../config/aws';
import DOMPurify from 'dompurify';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import './card_producto.scss';
import { formatoMexico, agregarPorcentaje } from '../../../../config/reuserFunction';
import { MenuContext } from '../../../../context/carritoContext';
import { makeStyles } from '@material-ui/styles';

const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

export default function Card_Producto_Frente(props) {
	const { productos } = props;
	const { colores } = useContext(MenuContext);

	const useStyles = makeStyles({
		background: {
			backgroundColor: colores.bodyPage.card.background,
			border: "none",
			"& .text-color": {
				color: colores.bodyPage.card.text
			}
		},
	});
	const classes = useStyles();

	if (productos.precioPromocion) {
		return (
			<div key={productos._id} className="size-col-prin col-lg-2 col-6">
				<Link to={`/vista_producto/${productos.productoPromocion._id}`}>
					<Card.Grid hoverable style={gridStyle} className={"contenedor-card-producto-principal " + classes.background}>
						<Card
							className={"contenedor-card-body " + classes.background}
							cover={
								<div className="contenedor-imagen-oferta">
									<div className="contenedor-oferta">
										<h5 className="shadow">OFERTA</h5>
									</div>
									<div className="contenedor-imagen-producto-principal">
										<img
											className="imagen-producto-principal"
											alt="producto"
											src={aws + productos.productoPromocion.imagen}
										/>
									</div>
								</div>
							}
						>
							<div className="contenedor-titulos-productos titulo-elipsis">
								<h1 className="titulo-producto text-color">{productos.productoPromocion.nombre}</h1>
								<div
								className="text-color"
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(productos.productoPromocion.descripcion)
									}}
								/>
							</div>
							<div className="contenedor-precios-productos">
								<h2 className="h5 precio-producto text-color mr-2">
									${formatoMexico(productos.productoPromocion.precio)}
								</h2>
								<h3 className="h5 precio-rebaja d-inline mr-1 text-color">
									${formatoMexico(productos.precioPromocion)}
								</h3>
								<p className="h4 porcentaje-descuento d-inline">
									{agregarPorcentaje(
										productos.precioPromocion,
										productos.productoPromocion.precio
									)}%OFF
								</p>
							</div>
						</Card>
					</Card.Grid>
				</Link>
			</div>
		);
	} else {
		return (
			<div key={productos._id} className="size-col-frente col-lg-2 col-6">
				<Link to={`/vista_producto/${productos._id}`}>
					<Card.Grid hoverable style={gridStyle} className={"frente contenedor-card-producto-principal " + classes.background}>
						<Card
							className={"frente-bajo frente contenedor-card-body " + classes.background}
							cover={
								<div className="contenedor-imagen-oferta ">
									{productos.promocion.length !== 0 ? (
										productos.promocion.map((promo) => {
											return (
												<div key={promo._id} className="oferta-frente">
													<h5 className="shadow">OFERTA</h5>
													{/* <p>-{agregarPorcentaje(promo.precioPromocion, productos.precio)}%</p> */}
												</div>
											);
										})
									) : (
										<div className="d-none" />
									)}

									<div className="contenedor-imagen-producto-principal ">
										<img
											className="imagen-producto-principal"
											alt="producto"
											src={aws + productos.imagen}
										/>
									</div>
								</div>
							}
						>
							<div className="frente contenedor-titulos-productos titulo-elipsis">
								<p className="font-secun titulo-producto text-color">{productos.nombre}</p>
								<div
									className="font-peque description text-color"
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(productos.descripcion)
									}}
								/>
							</div>
							{!productos.promocion.length ? (
								<div className="frente contenedor-precios-productos">
									<h3 className="font-prin precio-rebaja text-color">${formatoMexico(productos.precio)}</h3>
								</div>
							) : (
								productos.promocion.map((promo) => {
									return (
										<div className="frente contenedor-precios-productos text-color" key={promo._id}>
											<h2 className="font-peque precio-producto  mr-2">
												${formatoMexico(productos.precio)}
											</h2>
											<h3 className="font-prin precio-rebaja d-inline mr-1 text-color">
												${formatoMexico(promo.precioPromocion)}
											</h3>
											<p className="font-peque porcentaje-descuento d-inline">
												{agregarPorcentaje(promo.precioPromocion, productos.precio)}%OFF
											</p>
										</div>
									);
								})
							)}
						</Card>
					</Card.Grid>
				</Link>
			</div>
		);
	}
}