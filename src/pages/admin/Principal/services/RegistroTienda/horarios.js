import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Form, Switch, Divider, notification } from 'antd';
import './horarios.scss';
import clienteAxios from '../../../../../config/axios';
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
	const [ form ] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
	const [ editing, setEditing ] = useState(false);
	const inputRef = useRef(null);
	const form = useContext(EditableContext);
	useEffect(
		() => {
			if (editing) {
				inputRef.current.focus();
			}
		},
		[ editing ]
	);

	const toggleEdit = () => {
		setEditing(!editing);
		form.setFieldsValue({
			[dataIndex]: record[dataIndex]
		});
	};

	const save = async (e) => {
		try {
			const values = await form.validateFields();
			toggleEdit();
			handleSave({ ...record, ...values });
		} catch (errInfo) {
			console.log('Save failed:', errInfo);
		}
	};
	const saveOnChange = (e) => {
		let count;
		count = [ ...e.target.value ];

		if (count.length === 2 && e.nativeEvent.inputType !== 'deleteContentBackward') {
			form.setFieldsValue({
				[dataIndex]: e.target.value + ':'
			});
			return;
		}
		form.setFieldsValue({
			[dataIndex]: e.target.value
		});
	};

	let childNode = children;

	if (editable) {
		childNode = editing ? (
			<Form.Item
				style={{
					margin: 0
				}}
				name={dataIndex}
			>
				<Input ref={inputRef} onPressEnter={save} onBlur={save} onChange={saveOnChange} maxLength="5" />
			</Form.Item>
		) : (
			<div
				className="editable-cell-value-wrap"
				style={{
					paddingRight: 24,
					height: 25
				}}
				onClick={toggleEdit}
			>
				{children}
			</div>
		);
	}

	return <td {...restProps}>{childNode}</td>;
};

function HorariosAdmin({datosNegocio, reloadInfo, setReloadInfo, current, setCurrent}) {
    const form = useContext(EditableContext);
    const token = localStorage.getItem('token');
    const [ disable, setDisable ] = useState(true);
	const [ dataSource, setDataSource ] = useState([
		{
			key: '0',
			dia: 'Domingo',
			horaInicio: '',
			horaFinal: '',
			close: false
		},
		{
			key: '1',
			dia: 'Lunes',
			horaInicio: '',
			horaFinal: '',
			close: false
		},
		{
			key: '2',
			dia: 'Martes',
			horaInicio: '',
			horaFinal: '',
			close: false
		},
		{
			key: '3',
			dia: 'Miercoles',
			horaInicio: '',
			horaFinal: '',
			close: false
		},
		{
			key: '4',
			dia: 'Jueves',
			horaInicio: '',
			horaFinal: '',
			close: false
		},
		{
			key: '5',
			dia: 'Viernes',
			horaInicio: '',
			horaFinal: '',
			close: false
		},
		{
			key: '6',
			dia: 'Sabado',
			horaInicio: '',
			horaFinal: '',
			close: false
		}
	]);
	const columns = [
		{
			title: 'Dia',
			dataIndex: 'dia',
			editable: false,
			width: '25%'
		},
		{
			title: 'Hora apertura',
			dataIndex: 'horarioInicial',
			editable: true,
			width: '25%'
		},
		{
			title: 'Hora de cierre',
			dataIndex: 'horarioFinal',
			editable: true,
			width: '25%'
		},
		{
			title: 'Dias abiertos',
			dataIndex: 'close',
			width: '10%',
			render: (_, record) => (
				<Switch
					checked={record.close}
					checkedChildren="Abierto"
					unCheckedChildren="Cerrado"
					onChange={(value) => onChangeCloseDay(value, record)}
				/>
			)
		}
	];

    const components = {
		body: {
			row: EditableRow,
			cell: EditableCell
		}
	};

	const handleSave = (row) => {
		const newData = [ ...dataSource ];
		const index = newData.findIndex((item) => row.key === item.key);
		const item = newData[index];
		newData.splice(index, 1, { ...item, ...row });
		setDataSource(newData);
	};

	const onChangeCloseDay = (value, record) => {
		const newData = [ ...dataSource ];
		const index = newData.findIndex((item) => record.key === item.key);
		const item = newData[index];
		item.close = value;
		newData.splice(index, 1, { ...item, ...record });
		setDataSource(newData);
	};

	const onChange = (checked) => {
		setDisable(!checked);
	};

    const enviarDatos = async () => {
		await clienteAxios
			.put("/tienda/horario/empresa", 
            disable ? [] : dataSource
            , {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				notification.success({
					message: 'Registro exitoso',
					description: res.data.message
				});
                setReloadInfo(!reloadInfo);
                setCurrent(current + 1);
			})
			.catch((err) => {
				if (err.response) {
					notification.error({
						message: 'Error',
						description: err.response.data.message,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error de conexion',
						description: 'Al parecer no se a podido conectar al servidor.',
						duration: 2
					});
				}
			});
	};

    useEffect(() => {
        if (datosNegocio?.horario.length > 0){
            setDataSource(datosNegocio.horario);
            setDisable(false);
        }else{
            setDisable(true)
        }
    }, [ reloadInfo, datosNegocio ])

	const columnas = columns.map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				handleSave: handleSave
			})
		};
	});

	return (
		<div>
			<Divider className="mt-5">Horarios y Días Laborales</Divider>
			<div className="my-3">
				<p>Activar horarios</p>
				<Switch checked={disable ? false : true} onChange={onChange} />
			</div>
			<Table
				className="tabla-disable-horarios"
				components={components}
				rowClassName={() => 'editable-row'}
				bordered
				dataSource={dataSource}
				columns={columnas}
				pagination={false}
				loading={disable}
			/>
			<div className="mt-2 d-flex justify-content-right">
				<Button
					onClick={enviarDatos}
					type="primary"
					style={{
						marginBottom: 16
					}}
					size="large"
				>
					Guardar horarios
				</Button>
			</div>
		</div>
	);
}

export default HorariosAdmin;
