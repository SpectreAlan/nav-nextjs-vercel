import React from 'react';
import {Select} from 'antd';
import Icon from "@/components/Icon";

const iconfont = require('@/static/icon/iconfont.json')

const IconSelect: React.FC = () => {
    return <Select
        placeholder="选择图标"
        optionFilterProp="children"
        options={iconfont.glyphs.map(item => {
            const icon = 'icon-' + item.font_class
            return {
                label: <Icon type={icon} className='text-lg'/>,
                value: icon
            }
        })}
    />
}

export default IconSelect;