import React, { useState, useEffect, useContext } from 'react';
import './ofertas.scss';
import { withRouter } from 'react-router-dom';
import aws from '../../../config/aws';

import BannerAnim, { Element } from 'rc-banner-anim';
import 'rc-banner-anim/assets/index.css';
import { MenuContext } from '../../../context/carritoContext';

const BgElement = Element.BgElement;

function CarouselOfertas(props) {
	/* const [ index, setIndex ] = useState(0); */
	const { datosContx } = useContext(MenuContext);
	/* const [ esPromocion, setEsPromocion ] = useState(false); */

	/* const handleSelect = (selectedIndex, e) => {
		setIndex(selectedIndex);
	}; */

	if (datosContx.carrucel && datosContx.carrucel.length === 0 || !datosContx.carrucel) {
		return null
	}

	const render = datosContx.carrucel.map((carousel) => {
			return (
				<Element prefixCls="banner-user-elem" key={carousel._id}>
					<a href={carousel.nombre === "app" ?  "https://play.google.com/store/apps/details?id=com.fractalstudio.carranza" : null}  target="_blank" >
						<BgElement
							onClick={() =>
								props.history.push(
								carousel.producto ? `/vista_producto/${carousel.producto}` : '/'
							)}
							key="bg"
							className="bg banner-elemento"
							alt="img-oferta"
							style={{
								backgroundImage: `url(${aws + carousel.imagen})`,
								cursor: 'pointer' 
							}}
						>
						</BgElement>
					</a>
				</Element>
			);
	});

	return (
		<BannerAnim autoPlay /* activeIndex={index} */ /* onSelect={handleSelect} */ prefixCls="banner-user" autoPlaySpeed={2000} autoPlayEffect={false}>
				{render}
		</BannerAnim>
	);
}

export default withRouter(CarouselOfertas);
