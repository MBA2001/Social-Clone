import React from 'react'
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export default ({children, onClick, buttonClass, tipClass, tip, style, disabled}) => (
    <Tooltip title={tip} className={tipClass} placement="top" style={style}>
        <IconButton onClick={onClick} className={buttonClass}  disabled={disabled}>
            {children}
        </IconButton>
    </Tooltip>
);
