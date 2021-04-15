import React, { useState, useEffect, useContext } from 'react';
import { Divider, Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import './categorias.scss';
import './preloading.scss';
import { MenuContext } from '../../context/carritoContext';
import { makeStyles } from '@material-ui/styles';

const { SubMenu } = Menu;

const Categorias = (props) => {
	const { reloadFilter, datosContx, colores } = useContext(MenuContext);

	const [ categoriaSeleccionada, setCategoriaSeleccionada, ] = useState(null);
	const [ subcategoriaSeleccionada, setSubcategoriaSeleccionada, ] = useState(null);
	const [ temporadaSeleccionada, setTemporadaSeleccionada, ] = useState(null);
	const [ generoSeleccionado, setGeneroSeleccionado ] = useState(null);

	useEffect(() => {
		limpiarFiltros();
	}, [ reloadFilter ])

	const limpiarFiltros = () => {
		setCategoriaSeleccionada(null)
		setSubcategoriaSeleccionada(null)
		setTemporadaSeleccionada(null)
		setGeneroSeleccionado(null)
	}

	const useStyles = makeStyles({
		background: {
			backgroundColor: colores.navPrimary.background,
			color: colores.navPrimary.text,
		},
		hover: {
			'& > .ant-menu-submenu-title:hover': {
				color: `${colores.navPrimary.hoverText}!important`,
			},
			'& > .ant-menu-submenu-title': {
				color: `${colores.navPrimary.text}!important`,
			}
		},
		divider: {
			borderRight: `3px solid ${colores.navPrimary.text}`,
		}
	});
	const classes = useStyles();
	
	if (!datosContx.navbar || !datosContx.navbar.filtroNav || !datosContx.navbar.genero) {
		return null;
	}


	const categorias_nav = datosContx.navbar.filtroNav.map((categoria, index) => {
		return (
			<>
			<SubMenu
				key={categoria.categoria}
				title={categoria.categoria}
				className={"submenu-categoria nav-font-color-categorias container-subcategorias-nav size-submenu-cat font-cates " + classes.background + ' ' + classes.hover}
				onTitleClick={(e) => {
					if(e.key === categoria.categoria){
						props.history.push(`/filtros/${temporadaSeleccionada}/${categoria.categoria}/${subcategoriaSeleccionada}/${generoSeleccionado}`);
						setCategoriaSeleccionada(categoria.categoria);
					}
					
				}}

			>

				{categoria.subcCategoria.map((sub) => {
					return (
						<Menu.Item
							className="font-subcates "
							key={sub._id}
							onClick={() => {
								props.history.push(`/filtros/${temporadaSeleccionada}/${categoriaSeleccionada}/${sub._id}/${generoSeleccionado}`);
								setSubcategoriaSeleccionada(sub._id);
							}}
						>
							{sub._id}
						</Menu.Item>
					);
				})}
			</SubMenu>
			{
				datosContx.navbar.filtroNav.length -1 !== index? (
					<><Divider className={"divisor " + classes.divider} type="vertical"/></>
				):(
					null
				)
			}
			</>

		);
	});
	/* const temporadas_nav = temporadas.map((temporada, index) => {
		if(temporada._id){
			return (
				<Menu.Item
					className="nav-font-color-categorias font-cates"
					key={index}
					onClick={() => {
						props.history.push(`/filtros/${temporada._id}/${categoriaSeleccionada}/${subcategoriaSeleccionada}/${generoSeleccionado}`);
						setTemporadaSeleccionada(temporada._id);
					}}
				>
					{temporada._id}
				</Menu.Item>
			);
		}
		return
	}); */

	/* const categorias_generos = generos.map((generos) => {
		return (
			<Menu.Item
				className="font-cates"
				key={generos._id}
				onClick={() => {
					props.history.push(`/filtros/${temporadaSeleccionada}/${categoriaSeleccionada}/${subcategoriaSeleccionada}/${generos._id}`);
					setGeneroSeleccionado(generos._id)
				}}
				
			>
				{generos._id}
			</Menu.Item>
		);
	}); */

	return (
		<Layout className={"container-subcategorias-nav d-lg-inline size-layout-cat " + classes.background}>
			{/* <Spin className="ml-5 d-inline spin-nav-categorias" spinning={loading} />  */}
			<Menu
				className={"categorias-navbar d-inline size-menu-cat font-cates " + classes.background }
				theme="light"
				mode="horizontal"
				defaultSelectedKeys={[ window.location.pathname ]}
				triggerSubMenuAction="click"
			>
				{categorias_nav}
			</Menu>
		</Layout>
	);
};

export default withRouter(Categorias);
