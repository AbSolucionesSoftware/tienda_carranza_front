import React from 'react';
import { Button, Radio } from 'antd';
import { CreditCardOutlined, DollarCircleOutlined } from '@ant-design/icons';

export default function TipoPago({ prev, current, setCurrent, pagoTarjeta, setPagoTarjeta }) {
	
    const elegirTipoPago = (e) => setPagoTarjeta(e.target.value);

    const onNext = () => {
        if(pagoTarjeta){
            setCurrent(current +1);
        }else{
            setCurrent(current +2);
        }
    }
	return (
		<div>
			<div className="text-center my-5">
                <h4>Elige el tipo de pago</h4>
            </div>
			<div className="d-flex justify-content-center align-items-center">
                <div>
                    <Radio.Group onChange={elegirTipoPago} value={pagoTarjeta}>
                        <Radio className="d-flex justify-content-center align-items-center my-4" value={false}>
                            <h5>Pago en efectivo</h5>
                        </Radio>
                        {/* <Radio className="d-flex justify-content-center align-items-center my-4" value={true}>
                            <h5>Pago con tarjeta</h5>
                        </Radio> */}
                    </Radio.Group>
                </div>
            </div>
			<div className="steps-action d-flex justify-content-center align-items-center">
				<Button htmlType="submit" onClick={prev} size="large" className="m-1 color-boton">
					Volver
				</Button>
				<Button htmlType="submit" size="large" className="m-1 color-boton" onClick={onNext}>
					Siguiente
				</Button>
			</div>
		</div>
	);
}
