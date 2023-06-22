import React, {createContext, useEffect, useState} from 'react';
import Checkbox from "./CheckBox";
import useForm from "../../Hooks/useForm";


interface schVariableInterface {
    schVariable: string,
    selectMenu: (value: string) => void;
}

interface variableInterface {
    [key : string]: string | boolean
}

const DynamicFilter = ({schVariable , selectMenu}: schVariableInterface) => {
    const testArray1 = ['dynamic1' , 'dynamic2','dynamic3','dynamic4','dynamic5' ]
    const testArray2 = ['dynamic1' , 'dynamic2','dynamic3' ]

    const [array , setArray] = useState(schVariable === '1' ? testArray1 : testArray2);
    // 변수 변경 테스트용
    useEffect(() => {
        setArray(schVariable === '1' ? testArray1 : testArray2)
    } , [schVariable])


    const initVariable = {}

    const [variable , onChangeVariable , emptyCheck , onBlur] = useForm(initVariable)
    const [selectFilter , setSelectFilter] = useState<string []>([])

    useEffect(() => {
        setSelectFilter(selectVariable(variable))
    } , [variable])


    /**
     * 부모 컴포넌트에서 부르도록 해서 리스트를 반환 -> fitler 처리 후에 리스트 호출 하도록
     * @param variable
     */
    const selectVariable : (variable: variableInterface) => string[]  = (variable: variableInterface) => {
        const keyArray : string [] = Object.keys(variable)
        const resultArray : string[] = [];
        keyArray.map( (key: string) => {
            const resultBoolean = variable[key] as string;
            if (resultBoolean.toLowerCase() === 'true')
                resultArray.push(key)
        })
        return resultArray;
    }

    return (
        <>
            {
                array?.map( value => {
                    return <Checkbox key={value} onChange={onChangeVariable} name={`check_${value}`}/>
                })
            }
            {
                array.filter(value => selectFilter.length > 0 ? selectFilter.includes(value) : value == value)?.map( value => {
                    return <p key={value}>{value}</p>
                })
            }
        </>
    )
}

export default DynamicFilter;