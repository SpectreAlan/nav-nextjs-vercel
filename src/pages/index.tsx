import React, {useContext, useEffect, useState} from "react"
import {GlobalContext} from "@/GlobalContext";
import Icon from "@/components/Icon";
import {Card, Divider, Avatar, Space, Spin, Upload, Button} from 'antd'
const OSS = require('ali-oss');
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
const NavPage: React.FC = () => {
    const {nav, links, globalLoading} = useContext(GlobalContext)
    const [grid, setGrid] = useState<NavGrid[]>([])

    useEffect(() => {
        generateGrid()
    }, [nav, links])

    const generateGrid = () => {
        let gridList: NavGrid[] = [
            {
                sort: 0,
                key: 'hot',
                label: '热门推荐',
                icon: 'icon-paihangbang',
                parentId: '0',
                authorId: 'admin',
                links: links.filter(link => link.hot),
                navType: 1
            }
        ]
        const list: NavGrid[] = []
        const subList: NavGrid[] = []
        const temp = JSON.parse(JSON.stringify(nav))
        temp.map(item => {
            const {parentId, key} = item
            const itemLinks: Link[] = links.filter(link => link.navId === key)
            const target: NavGrid = {...item, links: itemLinks}
            parentId === '0' ? list.push(target) : subList.push(target)
        })
        list.sort((a, b) => a.sort - b.sort)
        subList.map(sub => {
            const {parentId, authorId, ...res} = sub
            const target: NavGrid = list.find(item => item.key === parentId)!
            if (!target.children) {
                target.children = []
            }
            target.children.push(sub)
        })
        list.map(item => {
            if (item.navType) {
                gridList.push(item)
            } else {
                if (item?.children) {
                    item.children.sort((a, b) => a.sort - b.sort)
                    gridList = [...gridList, ...item.children]
                }
            }
        })
        setGrid(gridList)
    }
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const props: any = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: async (file) => {
            const oss = new OSS({
                region: 'oss-cn-hongkong',
                accessKeyId: 'LTAI5tLRK1oJKXy3aJR61txA',
                accessKeySecret: 'CnfwvwbO5wNLd3btXnZGa9LgTv8xxL',
                bucket: 'nav-vercel',
            });
            const result = await oss.put('avator.png', file);
            console.log(result.url);
        },
        fileList,
    };
    const handleUpload =async () => {
        setUploading(true);

        const oss = new OSS({
            region: 'oss-cn-hongkong',
            accessKeyId: 'LTAI5tLRK1oJKXy3aJR61txA',
            accessKeySecret: 'CnfwvwbO5wNLd3btXnZGa9LgTv8xxL',
            bucket: 'nav-vercel',
        });
        const result = await oss.put('avator.png', fileList[0]);
        console.log(result);
        return result.url;

    };
    return (
        <Spin spinning={globalLoading}>
            <Upload {...props}>
                <Button>Select File</Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
            >
                {uploading ? 'Uploading' : 'Start Upload'}
            </Button>
            {
                grid.map((item: NavGrid) =>
                    <div key={item.key}>
                        <Divider orientation="left" orientationMargin="0">
                            <Space>
                                {
                                    item?.icon ? <Icon type={item.icon as string} key={item.label}/> : null
                                }
                                {item.label}
                            </Space>
                        </Divider>
                        <div className="grid gap-x-4 gap-y-4 grid-cols-5">
                            {
                                item.links.map(link => <Card
                                    key={link.id}
                                    style={{width: 300}}
                                    actions={[
                                        <Icon type='icon-pinglun' key="comment"/>,
                                        <Icon type='icon-love' key="like"/>,
                                        <Icon type='icon-bianji' key="edit"/>,
                                        <Icon type='icon-shanchu' key="del"/>,
                                    ]}
                                >
                                    <Card.Meta
                                        avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel"/>}
                                        title={link.name}
                                        description={link.desc}
                                    />
                                </Card>)
                            }
                        </div>
                    </div>
                )
            }
        </Spin>
    )
}

export default NavPage
