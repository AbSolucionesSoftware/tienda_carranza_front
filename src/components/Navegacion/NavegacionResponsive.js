import { makeStyles } from '@material-ui/styles';
import { Button, Drawer, Badge } from 'antd';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { MenuContext } from '../../context/carritoContext';
import {
	SearchOutlined,
	MenuOutlined,
	ShoppingOutlined,
	SettingOutlined,
	LogoutOutlined,
	UserOutlined,
	CloseCircleOutlined
} from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import RightMenu from './RightMenu';
import aws from '../../config/aws';
import './navegacion.scss';
import Layout, { Header } from 'antd/lib/layout/layout';
import Search from 'antd/lib/input/Search';


export default function NavegacionResponsive(props) {
    const { loading, datosContx, colores } = useContext(MenuContext);
    const {openSearch, setOpenSearch} = props;
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

    return (
        <>
            <div className="top-menu-responsive container">
                <div className="col-3 car-responsive">
                    <Button type="link" className="barsMenu" onClick={showDrawer}>
                        <MenuOutlined className={"menu-responsivo-icon " + classes.background} style={{ fontSize: 22 }} />
                    </Button>
                </div>
                <div className="col-5">
                    {datosContx.tienda && datosContx.tienda.length > 0 ? !datosContx.tienda[0]
                        .imagenLogo ? (
                        <div className="d-none" />
                    ) : (
                        <Link to="/">
                            <div className="contenedor-logo d-flex justify-content-center">
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
                </div>
                <div className="col-4 car-responsive">
                    {!decoded || decoded.rol === true ? (
                        <div className="d-none" />
                    ) : (
                        <div className="p-2">
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
                    <div className="p-2">
                        <SearchOutlined
                            onClick={ () => setOpenSearch(!openSearch)}
                            className={"menu-responsivo-icon " + classes.background}
                            style={{ fontSize: 26 }} 
                        />
                    </div>
                </div>
               
            </div>
            

            <Drawer
                className="drawer-background"
                title={
                    datosContx.tienda && datosContx.tienda.length > 0 ? !datosContx.tienda[0].imagenLogo ? (
                        <div className="d-none" />
                    ) : (
                        <div className="contenedor-logo-responsivo p-1">
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

           
        </>
    )
}
