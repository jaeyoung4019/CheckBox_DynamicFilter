import React, {createContext, useEffect, useMemo, useState} from "react";
import Checkbox from "./CheckBox";
import useForm from "../../Hooks/useForm";

interface schVariableInterface {
    schVariable: string;
    selectMenu: (value: string) => void;
}

interface variableInterface {
    [key: string]: string | boolean;
}

const DynamicFilter = ({ schVariable, selectMenu }: schVariableInterface) => {
    const testArray1 = ["dynamic1", "dynamic2", "dynamic3", "dynamic4", "dynamic5" , "dynamic6" , "dynamic7" , "dynamic8" , "dynamic348" , "dynamic82" , "dynamic812223" , "dynamic8123" , "dynamic81244" , "dynamic338" , "dynamic811" ,"dynamic558" ];
    const testArray2 = ["dynamic1", "dynamic2", "dynamic3"];

    const [array, setArray] = useState(testArray1);

    //변수 변경 테스트용
    useEffect(() => {
        setArray(testArray1.slice(0 ,5));
    }, [schVariable]);

    const initVariable = {};

    const [variable, onChangeVariable, emptyCheck, onBlur] = useForm(initVariable);
    const [selectFilter, setSelectFilter] = useState<string[]>([]);

    useEffect(() => {
        setSelectFilter(selectVariable(variable));
    }, [variable]);

    /**
     * 부모 컴포넌트에서 부르도록 해서 리스트를 반환 -> fitler 처리 후에 리스트 호출 하도록
     * @param variable
     */
    const selectVariable: (variable: variableInterface) => string[] = (variable: variableInterface) => {
        const keyArray: string[] = Object.keys(variable);
        const resultArray: string[] = [];
        keyArray.map((key: string) => {
            const resultBoolean = variable[key] as string;
            if (resultBoolean.toLowerCase() === "true") resultArray.push(key);
        });
        return resultArray;
    };

    const [count , setCount] = useState<number>(2);

    const sliceClosure : () => (number) = useMemo( () => (function () {
        let plus = 5
        return function () {
            plus += 5;
            if (testArray1.length - 4 <=  plus) {
                plus = testArray1.length;
                return plus
            } else {
                return plus;
            }
        }
    }()) , [])

    const filterLengthFuncState = () => {
        setCount( (value) => {
            if (testArray1.length - 4 <= value) {
                return testArray1.length
            } else
            return value + 5
        })
        console.log(count)
    }

    const filterLengthClosure = () => {
        const countClosure = sliceClosure();
        setArray(testArray1.slice(0 ,countClosure));
    }

    // useEffect(() => {
    //     setArray(testArray1.splice(0 ,count));
    // }, [count])

    return (
        <>
            {array?.map(value => {
                return <Checkbox key={value} onChange={onChangeVariable} name={`check_${value}`} />;
            })}
            {array
                .filter(value => (selectFilter.length > 0 ? selectFilter.includes(value) : value == value))
                ?.map(value => {
                    return <p key={value}>{value}</p>;
                })}
            <button onClick={filterLengthClosure} >more</button>
        </>
    );
};

export default DynamicFilter;
