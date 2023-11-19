import React from 'react'
import Icon from "@/components/Icon/index";
import {copy} from '@/utils/common'

interface IProps {
    val?: string
    title?: string
}

const Copy: React.FC<IProps> = ({val, title}) => {
    return val ? <Icon
        type='icon-fuzhi'
        title={'复制' + (title || '')}
        className='pointer'
        onClick={() => copy(val)}
    /> : null
}

export default Copy