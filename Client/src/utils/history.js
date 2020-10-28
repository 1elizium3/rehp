/*
  Объект истории браузера отслеживает историю просмотров приложения с помощью встроенного 
  стека истории браузера. Он предназначен для запуска в современных веб-браузерах, 
  поддерживающих интерфейс истории HTML5, включая pushState, replaceState и событие popstate.
*/

import { createBrowserHistory } from 'history';

export default createBrowserHistory;