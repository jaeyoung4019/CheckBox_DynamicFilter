import React from 'react';

interface Props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    name: string
}

const CheckBox = ({onChange , name} : Props) => {
    return (
        <input type={"checkbox"} onChange={onChange} name={name}/>
    )
}

export default CheckBox;