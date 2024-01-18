import React from 'react';
import { Card, Row, Col, Statistic, Divider } from 'antd';
import { LineChart, BarChart } from 'recharts';
import { Line, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';


const DashboardAdmin = () => {
    const entityData = [
        { name: 'Entidad 1', value: 100 },
        { name: 'Entidad 2', value: 200 },
        { name: 'Entidad 3', value: 150 },
    ];

    const communicationData = [
        { name: 'ejemplo', value: 50 },
        { name: 'perro', value: 100 },
        { name: 'loco', value: 75 },
    ];

    const notifications = [
        { id: 1, message: 'Notification 1' },
        { id: 2, message: 'Notification 2' },
        { id: 3, message: 'Notification 3' },
    ];

    return (
        <div>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Entities" value={entityData.length} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Communications" value={communicationData.length} />
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Entity Data">
                        <LineChart width={400} height={300} data={entityData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Communication Data">
                        <BarChart width={400} height={300} data={communicationData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Card title="Notifications">
                {notifications.map((notification) => (
                    <p key={notification.id}>{notification.message}</p>
                ))}
            </Card>
        </div>
    );
};

export default DashboardAdmin;
