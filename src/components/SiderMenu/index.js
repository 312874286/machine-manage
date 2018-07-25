import 'rc-drawer/assets/index.css';
import React from 'react';
import DrawerMenu from 'rc-drawer';
import SiderMenu from './SiderMenu';

export default props => (
  props.isMobile ? (
    <DrawerMenu
      // parent={null}
      getContainer={null}
      level={null}
      // iconChild={null}
      handler={<div className="drawer-handle"><i className="drawer-handle-icon" /></div>}
      onHandleClick={() => {
        props.onCollapse(!props.collapsed);
      }}
      open={!props.collapsed}
      onMaskClick={() => { props.onCollapse(true); }}
      width="180px"
    >
      <SiderMenu {...props} collapsed={props.isMobile ? false : props.collapsed} />
    </DrawerMenu>
  ) : <SiderMenu {...props} />
);

