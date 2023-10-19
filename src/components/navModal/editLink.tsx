import React, {useContext, useState} from 'react'
import Icon from "@/components/Icon";
import AddOrEditLink from "@/components/linkModal/addOrEditLink";
import {GlobalContext} from "@/GlobalContext";
interface IProps {
    link: Link
}

const EditLink:React.FC<IProps> = ({link})=>{
    const { refreshLinks} = useContext(GlobalContext)
    const [linkModalVisible, setLinkModalVisible] = useState<boolean>(false);
    const editLink = ()=>{
        setLinkModalVisible(true)
    }
    return <>
        <Icon type='icon-bianji' key="edit" onClick={editLink} title='编辑链接'/>
        {
            linkModalVisible ? <AddOrEditLink
                setLinkModalVisible={setLinkModalVisible}
                info={link}
                navId={link.navId}
                refreshLinks={refreshLinks}
            /> : null
        }
    </>
}
export default EditLink