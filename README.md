# 사용처
![image](https://github.com/jaeyoung4019/CheckBox_DynamicFilter/assets/135151752/4d95d660-e429-4887-a455-e1a2d2442d2f)

위 사진의 Fiters 부분을 API 요청의 반환 값에 따라 다이나믹하게 구성하고 클릭 시 list 가 update 되야하는 기능.
1차적인 기능만 우선적으로 TEST 코드로 구현해놓을 예정입니다.

# 개발환경
- 노드 버전
```ts
v16.16.0
```
- npm 버전
```ts
8.11.0
```

- Function Test

CheckBox.tsx
```ts
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
```

체크박스를 컴포넌트로 구현합니다. 
간단하게 변경된 사항들만 사용할 수 있도록 처리했습니다. css 나 blur는 다른 기능을 개발하면서 추상화 시킬 예정입니다.

DynamicFilter.tsx
```ts
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
```


  - 체크박스를 선택했을 때 variable 을 가져오는 function
  ```ts
     array?.map( value => {
                    return <Checkbox key={value} onChange={onChangeVariable} name={`check_${value}`}/>
                })
  ```
  ```ts
  const [variable , onChangeVariable , emptyCheck , onBlur] = useForm(initVariable)
  ```
  
  useForm 이라는 Custom Hook 을 사용해서 가져오도록합니다. useForm 에 대한 링크는 아래와 같습니다.


  https://github.com/jaeyoung4019/custom-Hook-useForm

  
  variable 을 한 번에 관리해서 variable 이 선택 되었을 때 useEffect 로 list 를 변경해주는 함수를 작성합니다.
  ```ts
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
  ```
  
  ```ts
  const keyArray : string [] = Object.keys(variable)
  ```
  - 선택된 variable 을 가지고 key 로 array 를 생성하여 true , false 를 검증할 수 있도록 합니다.
  
  ```ts
       const resultArray : string[] = [];
        keyArray.map( (key: string) => {
            const resultBoolean = variable[key] as string;
            if (resultBoolean.toLowerCase() === 'true')
                resultArray.push(key)
        })
  ```
  생성된 keyArray 로 value 를 가져와서 true 인지 false 인지 체크한 다음 true 인 것들만 array 에 담에 return 합니다.
  이렇게 하면 선택된 key 들이 array 에 담기고 string 값으로 list 에 대한 value 를 filter 처리할 수 있습니다.
  
  ```ts
       array.filter(value => selectFilter.length > 0 ? selectFilter.includes(value) : value == value)?.map( value => {
                    return <p key={value}>{value}</p>
                })
  ```
  filter 처리를 하는데 필터에 담긴 배열의 길이가 0이면 전체검색인 상태임으로 value 를 그대로 리턴해주도록 합니다. 이 외의 상황일 경우 선택된 키값과 일치한 list 만 내보낼 수 있도록 includes 로 filter 처리를 합니다.


# 렌더링 시에 사용하기 위한 클로져
useMemo를 사용해서 처리하면 됩니다.
```ts
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
```

버튼 클릭 시
```ts

    const filterLengthClosure = () => {
        const countClosure = sliceClosure();
        setArray( testArray1.slice(0 ,countClosure));
    }

```
