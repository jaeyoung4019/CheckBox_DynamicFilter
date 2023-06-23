import React, { createContext, useEffect, useState } from "react";
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
    const testArray1 = ["dynamic1", "dynamic2", "dynamic3", "dynamic4", "dynamic5" , "dynamic6" , "dynamic7" , "dynamic8"];
    const testArray2 = ["dynamic1", "dynamic2", "dynamic3"];

    const [array, setArray] = useState(testArray1);

    // 변수 변경 테스트용
    useEffect(() => {
        setArray(testArray1.splice(0 ,2));
    }, [schVariable]);

    const initVariable = {};

    // const slice: ({start , end}: {start: number , end: number}) => {start: number , end: number} = ({start , end} : {start: number , end: number}) => {
    //    end += 2;
    //    return {start: start, end: end}
    // }



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

    const sliceClosure = (function () {
        let plus = 2
        return function () {
            //plus + number
            ++plus;
            // plus + 2 는 안됨
            return ++plus;
            // return function () {
            //     //plus + number
            //     return ++plus;
            // }
        }
    }())

    const filterLengthFunc = () => {
        // const count = sliceClosure()
        // console.log(count)
        setCount( (value) => {
            if (testArray1.length - 1 <= value) {
                return testArray1.length
            } else
            return value + 2
        })
        // set 사용해서 렌더링 새로 되니까 클로저를 해도 즉시 실행함수가 다시 호출 되서 초기화 됨.
        console.log(count)
    }

    useEffect(() => {
        setArray(testArray1.splice(0 ,count));
    }, [count])

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
            <button onClick={filterLengthFunc} >more</button>
        </>
    );
};

export default DynamicFilter;
