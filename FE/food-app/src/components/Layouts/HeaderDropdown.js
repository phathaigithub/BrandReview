import React from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
// const avatar = 

const HeaderDropDown = ({ avatar, name }) => {
    const items = [
        {
            key: '1',
            label: (
                <a href="/information">
                    Thông tin cá nhân
                </a>
            ),
        },
        {
            key: '2',
            danger: true,
            label: (<a href='/' onClick={(e) => { e.preventDefault(); handleLogout(); }}>Đăng xuất</a>),
        },
    ];
    const history = useHistory();
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        history.push("/"); // You can also use a routing library like react-router
    };
    const avatarPath = "http://localhost:8080/uploads/" + avatar;
    return (
        <a href="javascript:void(0);">
            <Dropdown
                menu={{
                    items
                }}
                placement="bottomRight"
                arrow
                trigger={"click"}
            >
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        <h5 class="pt-2">{name}</h5>
                        <Avatar src={avatarPath} className='me-1' />
                    </Space>
                </a>
            </Dropdown>
        </a>
    );
};

export default HeaderDropDown;