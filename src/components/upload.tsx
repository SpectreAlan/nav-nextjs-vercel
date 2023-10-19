import React, {useState} from 'react';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {message, Upload} from 'antd';
import type {RcFile } from 'antd/es/upload/interface';
import {FormInstance} from "antd/es/form";
const OSS = require('ali-oss');

interface IProps {
    icon: string | undefined
    form: FormInstance
}

const UploadAliOSS: React.FC<IProps> = ({icon, form}) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(icon || '');

    const beforeUpload = async (file: RcFile) => {
        console.log(file.type);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'|| file.type === 'image/x-icon';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG/ICO file!');
            return
        }
        const isLt2M = file.size / 1024  < 500;
        if (!isLt2M) {
            message.error('Image must smaller than 500k!');
            return
        }
        setLoading(true)
        const oss = new OSS({
            region: process.env.NEXT_PUBLIC_OSS_ALIYUN_REGION,
            accessKeyId: process.env.NEXT_PUBLIC_OSS_ALIYUN_RKEY,
            accessKeySecret: process.env.NEXT_PUBLIC_OSS_ALIYUN_SECRET,
            bucket: process.env.NEXT_PUBLIC_OSS_ALIYUN_BUCKET,
        });
        const result = await oss.put(`/nav/favicon/${new Date().getTime()}.${file.type.split('/')[1]}`, file);
        setImageUrl(result.url);
        form.setFieldsValue({icon: result.url})
        setLoading(false)
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined rev={''}/> : <PlusOutlined rev={''}/>}
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    return (
        <Upload
            listType="picture-circle"
            showUploadList={false}
            beforeUpload={beforeUpload}
        >
            {imageUrl ? <img src={imageUrl} alt="favicon" style={{width: '100%'}}/> : uploadButton}
        </Upload>
    );
};

export default UploadAliOSS;