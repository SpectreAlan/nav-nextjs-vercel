import dynamic from 'next/dynamic';

const Icon = dynamic(() => import('@ant-design/icons').then(icons => icons.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4220832_9hrkcq5zwwc.js',
})), { ssr: false });

export default Icon