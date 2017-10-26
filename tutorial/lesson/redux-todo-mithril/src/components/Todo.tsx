import { ClassComponent, Vnode } from 'mithril';
import * as m from 'mithril'; // tslint:disable-line: no-duplicate-imports
import TodoState from '../models/TodoState';
import DeleteTodo from '../containers/DeleteTodo';

interface IAttr extends TodoState {
  onClick: (id: number) => void;
}

export default class Todo implements  ClassComponent<IAttr> {
  /**
   *
   * @param vnode
   */
  public view({ attrs }: Vnode<IAttr, this>): Vnode<IAttr, HTMLElement> {
    const { id, text, completed, onClick } = attrs;
    const classes = completed ? 'completed' : '';
    console.log(attrs);
    return (
    <li class={classes}>
      <label>
        <input class="toggle" type="checkbox" onclick={onClick} checked={completed} />
        {text}
      </label>
      <DeleteTodo id={id}>x</DeleteTodo>
    </li>);
  }
}
