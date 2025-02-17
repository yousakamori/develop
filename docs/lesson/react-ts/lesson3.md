[Redux ExampleのTodo ListをはじめからていねいにをTypescriptで(1)][*3],
[Redux ExampleのTodo ListをはじめからていねいにをTypescriptで(2)][*2]の続き。  
[Redux ExampleのTodo Listをはじめからていねいに(3)][*1]をtypescriptで書いたメモ。

## 1. actionCreatorとreducerでフィルターの値をstore(state)に格納

### actionCreatorの作成

```ts:src/actions/index.tsx
// 省略

export interface IVisibilityFilter extends Action{
    type: 'SET_VISIBILITY_FILTER',
    filter: string
}

//省略

export const setVisibilityFilter = (filter:string) : IVisibilityFilter => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}
```

### reducersの作成

```ts:src/reducers/visibilityFilter.tsx
import { IVisibilityFilter } from '../actions';

const visibilityFilter = (state = 'SHOW_ALL', action:IVisibilityFilter) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

export default visibilityFilter;
```

```ts:src/reducers/index.tsx
import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter';

const todoApp = combineReducers({ 
  todos,
  visibilityFilter 
});
export default todoApp;
```

### 確認

```ts:src/app.tsx
// 省略

import { addTodo, toggleTodo, setVisibilityFilter } from './actions';

// 省略

console.log(store.getState()) // => Object {todos: Array[0], visibilityFilter: "SHOW_ALL"}
store.dispatch(setVisibilityFilter('SHOW_COMPLETED'))
console.log(store.getState()) // => Object {todos: Array[0], visibilityFilter: "SHOW_COMPLETED"}

// 省略
```

### ここの時点のソース

[github](https://github.com/hibohiboo/develop/tree/72a4f4790dd18fe9d085408df6be9a924074ffb4/tutorial/lesson/react-ts)


## 2. フィルターの値によってviewを変更（手動でフィルターを操作して動作確認）

### VisibleTodoListコンテナの修正

filterの値をストリングリテラル型で指定。

```ts:src/states/VisibilityFilterType.tsx
export type VisibilityFilterType = 'SHOW_ALL' | 'SHOW_COMPLETED' | 'SHOW_ACTIVE';
```

```ts:src/components/VisibleTodoList.tsx
// 省略

import { VisibilityFilterType } from '../states/VisibilityFilterType';

// 省略

const getVisibleTodos = (todos: TodoState[], filter:VisibilityFilterType):TodoState[] => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter((t) => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter((t) => !t.completed)
  }
}

const mapStateToProps = (store): IStateToProps => {
  return {
    todos: getVisibleTodos(store.todos, store.visibilityFilter)
  }
}
```

### ここの時点のソース
[github](https://github.com/hibohiboo/develop/tree/d5cacb33a4fe60835fb9d5b1451c7d3f47ba740b/tutorial/lesson/react-ts)

## 3. リンクをクリックしてフィルターを操作してviewを変更

### とりあえず、リンクを表示させる

```ts:src/components/Link.tsx
import * as React from 'react'; 
import {  Props, EventHandler, MouseEvent, Component } from 'react';

interface IProps extends Props<Link>{
    children?: React.ReactElement<any>[];
}

interface IState {};

export default class Link extends Component<IProps, IState> {
  render(): JSX.Element{
    return (<a href="#">{this.props.children}</a>);
  }
}
```

```ts:src/components/Footer.tsx
import * as React from 'react'; 
import {  Props, EventHandler, MouseEvent, Component } from 'react';
import Link from './Link';

interface IProps {};

interface IState {};

export default class Footer extends Component<IProps, IState> {
  render(): JSX.Element{
    return (
      <p>
        Show:
        {" "}
        <Link>
          All
        </Link>
        {", "}
        <Link>
          Active
        </Link>
        {", "}
        <Link>
          Completed
        </Link>
      </p>
      );
  }
}
```

```ts:src/components/App.tsx
import Footer from './Footer'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)
```

#### ここの時点のソース
[github](https://github.com/hibohiboo/develop/tree/8f5755aa43dcba541b91c3b35f7916b9124472ac/tutorial/lesson/react-ts)

### Linkコンテナでdispatch(setVisibilityFilter())を呼び出せるようにする

```ts:src/components/FilterLink.tsx
import { connect } from 'react-redux';
import { setVisibilityFilter } from '../actions';
import Link from '../components/Link';
import { VisibilityFilterType } from '../states/VisibilityFilterType';

interface IState{
  visibilityFilter: VisibilityFilterType
}

interface IProps{
  filter:VisibilityFilterType
}

interface IStateToProps{
  state:any
}

interface IDispatchToProps{
  onClick: Function
}

const mapStateToProps = (state:IState, ownProps:IProps):IStateToProps => {
  return { 
    state:state
  }
}

const mapDispatchToProps = (dispatch, ownProps:IProps):IDispatchToProps => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link);

export default FilterLink
```

```ts:src/components/Footer.tsx
import * as React from 'react'; 
import {  Props, EventHandler, MouseEvent, Component } from 'react';
import Link from './Link';
import FilterLink from '../containers/FilterLink'

interface IProps {};

interface IState {};

export default class Footer extends Component<IProps, IState> {
  render(): JSX.Element{
    return (
        <p>
          Show:
          {" "}
          <FilterLink filter="SHOW_ALL">
            All
          </FilterLink>
          {", "}
          <FilterLink filter="SHOW_ACTIVE">
            Active
          </FilterLink>
          {", "}
          <FilterLink filter="SHOW_COMPLETED">
            Completed
          </FilterLink>
        </p>
      );
  }
}
```

### クリックしたときにonClickを呼ぶ


```ts:src/components/Link.tsx
import * as React from 'react'; 
import {  Props, Component } from 'react';

interface ILinkProps extends Props<Link>{
    children?:any;
    state:any;
    onClick:Function; 
}
interface ILinkState {};

class Link extends Component<ILinkProps, ILinkState> {
  render(): JSX.Element{
    return (
      <a href="#"
         onClick={(e) => {
           e.preventDefault()
           this.props.onClick()
         }}
      >{this.props.children}</a>
    );
  }
}

export default Link;
```

### activeな状態なリンクを押せないようにする

```ts:src/components/FilterLink.tsx
// 省略

interface IStateToProps{
  active: boolean
}

// 省略

const mapStateToProps = (state:IState, ownProps:IProps):IStateToProps => {
  return { 
    active: ownProps.filter === state.visibilityFilter
  }
}
// 省略

```

```ts:src/components/Link.tsx
import * as React from 'react'; 
import {  Props, Component } from 'react';

interface ILinkProps extends Props<Link>{
    children?:any;
    active:boolean;
    onClick:Function; 
}
interface ILinkState {};

class Link extends Component<ILinkProps, ILinkState> {
  render(): JSX.Element{
    if (this.props.active) {
      return <span>{this.props.children}</span>
    }

    return (
      <a href="#"
         onClick={(e) => {
           e.preventDefault()
           this.props.onClick()
         }}
      >{this.props.children}</a>
    );
  }
}

export default Link;
```

### ここの時点のソース
[github](https://github.com/hibohiboo/develop/tree/bfa404246f49c4a658a2e5d5034404de1a71c9ca/tutorial/lesson/react-ts)


## 参考

[Redux ExampleのTodo Listをはじめからていねいに(3)][*1]  
[Redux ExampleのTodo ListをはじめからていねいにをTypescriptで(2)][*2]  
[Redux ExampleのTodo ListをはじめからていねいにをTypescriptで(1)][*3]  
[TypeScriptでのイベント名を管理・指定するもう一つの方法(＋ストリングリテラル型にも対応)][*4]  
[TypeScript の JSX/React サポートを試す][*5]
[TypeScript をざっとペロる][*6]


[*1]:http://qiita.com/xkumiyu/items/1ba476b8043b71561f52
[*2]:http://qiita.com/hibohiboo/items/ca9d5a5bb04d0a50db00
[*3]:http://qiita.com/hibohiboo/items/e344d2bbbaaab0ba8a66
[*4]:http://qiita.com/ConquestArrow/items/02826db3ddbe98d280bd
[*5]:http://qiita.com/kimamula/items/11873444e6a4df19df37
[*6]:http://qiita.com/Chrowa3/items/a566489392fc1c969b88