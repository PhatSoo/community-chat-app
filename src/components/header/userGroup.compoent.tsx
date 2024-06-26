'use client';

import { fetchWithAuth } from '@/configs';
import { useAppContext } from '@/providers/app.provider';
import { ResponseType, UserType } from '@/types';
import {
    LogoutOutlined,
    PlusCircleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps, Space, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
const { Text } = Typography;

interface IProps {
    user: UserType;
}

const items: MenuProps['items'] = [
    {
        label: 'Profile',
        key: 'profile',
        icon: <UserOutlined />,
    },
    {
        label: 'Post Blog',
        key: 'post',
        icon: <PlusCircleOutlined />,
    },
    {
        label: 'Logout',
        key: 'logout',
        icon: <LogoutOutlined />,
        danger: true,
    },
];

const UserGroup = ({ user }: IProps) => {
    const router = useRouter();
    const handleMenuClick: MenuProps['onClick'] = async (e) => {
        if (e.key === 'logout') {
            return await handleLogout();
        } else if (e.key === 'post') {
            return router.push('/post');
        } else return router.push('/me');
    };

    const [_, setSession] = useAppContext();

    const handleLogout = async () => {
        const res: ResponseType = await fetchWithAuth('/auth/logout', {
            method: 'POST',
        });

        if (res.statusCode === 200) {
            await fetch('/api/auth/logout', { method: 'POST' });
            setSession({ accessToken: '', refreshToken: '' });

            return router.refresh();
        }

        message.error(res.message);
    };

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (
        <Space>
            {user ? <Text code>Hello, {user.displayName}</Text> : ''}
            <Dropdown menu={menuProps} placement="bottomRight" arrow>
                <Avatar
                    style={{ backgroundColor: '#87d068' }}
                    icon={<UserOutlined />}
                />
            </Dropdown>
        </Space>
    );
};

export default UserGroup;
