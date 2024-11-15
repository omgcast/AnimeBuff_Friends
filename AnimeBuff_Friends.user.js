// ==UserScript==
// @name         AnimeBuff Авто Добавление в Друзья Без Ограничений (Ускоренный)
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Автоматически отправляет запросы в друзья на AnimeBuff.ru и переходит к следующим пользователям рандомно, только если кнопка "Добавить в друзья". Не использует localStorage. Ускоренный режим.
// @author       Ваше Имя
// @match        https://animebuff.ru/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Настройки
    const MIN_USER_ID = 525;
    const MAX_USER_ID = 118000;
    const DELAY_MIN = 1000; // Минимальная задержка в миллисекундах (1 секунда)
    const DELAY_MAX = 3000; // Максимальная задержка в миллисекундах (3 секунды)
    const BUTTON_SELECTOR = 'button.new-profile__action-btn.friend-btn.tooltipped';
    const BUTTON_WAIT_TIMEOUT = 5000; // Таймаут ожидания появления кнопки (5 секунд)
    const BUTTON_STATE_TIMEOUT = 5000; // Таймаут ожидания изменения состояния кнопки (5 секунд)

    // Функция для получения ID пользователя из URL
    function getUserIdFromURL() {
        const urlParts = window.location.pathname.split('/');
        return urlParts[urlParts.length - 1] || 'Unknown';
    }

    // Функция для генерации случайной задержки
    function getRandomDelay() {
        return Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN + 1)) + DELAY_MIN;
    }

    // Функция для генерации случайного ID пользователя
    function getRandomUserId() {
        return Math.floor(Math.random() * (MAX_USER_ID - MIN_USER_ID + 1)) + MIN_USER_ID;
    }

    // Функция для перехода к следующему случайному пользователю
    function goToNextUser() {
        const randomId = getRandomUserId();
        console.log(`Переход на пользователя с ID: ${randomId}`);
        window.location.href = `https://animebuff.ru/users/${randomId}`;
    }

    // Функция для отправки запроса в друзья
    function sendFriendRequest(callback) {
        const button = document.querySelector(BUTTON_SELECTOR);
        if (button) {
            const buttonTooltip = button.getAttribute('data-tooltip');
            console.log(`Текущий data-tooltip кнопки: "${buttonTooltip}"`);

            if (buttonTooltip === 'Добавить в друзья') {
                button.click();
                const userId = getUserIdFromURL();
                console.log(`Запрос в друзья отправлен пользователю с ID: ${userId}`);
                monitorButtonState(button, callback);
            } else {
                console.log('Кнопка не "Добавить в друзья". Переход к следующему пользователю.');
                callback();
            }
        } else {
            console.log('Кнопка добавления в друзья не найдена. Переход к следующему пользователю.');
            callback();
        }
    }

    // Функция для мониторинга изменения состояния кнопки после клика
    function monitorButtonState(button, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            for (let mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-tooltip') {
                    const newTooltip = button.getAttribute('data-tooltip');
                    if (newTooltip === 'Отклонить заявку' || newTooltip === 'Удалить из друзей') {
                        console.log('Статус кнопки изменен: Запрос отправлен успешно.');
                        obs.disconnect();
                        callback();
                        break;
                    }
                }
            }
        });

        // Настройки наблюдателя: следим за изменениями атрибута 'data-tooltip'
        observer.observe(button, { attributes: true });

        // Таймаут на случай, если состояние не изменится
        setTimeout(() => {
            if (observer) {
                console.log('Таймаут: состояние кнопки не изменилось.');
                observer.disconnect();
                callback();
            }
        }, BUTTON_STATE_TIMEOUT); // 5 секунд
    }

    // Основная функция автоматизации
    function automate() {
        sendFriendRequest(() => {
            const delay = getRandomDelay();
            console.log(`Следующий запрос через ${delay / 1000} секунд.`);
            setTimeout(goToNextUser, delay);
        });
    }

    // Функция ожидания появления кнопки на странице с использованием MutationObserver
    function waitForButton() {
        const button = document.querySelector(BUTTON_SELECTOR);
        if (button) {
            console.log('Кнопка найдена.');
            automate();
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const btn = document.querySelector(BUTTON_SELECTOR);
            if (btn) {
                console.log('Кнопка появилась.');
                obs.disconnect();
                automate();
            }
        });

        // Настройки наблюдателя: следим за изменениями в body
        observer.observe(document.body, { childList: true, subtree: true });

        // Таймаут на случай, если кнопка не появится
        setTimeout(() => {
            console.log('Таймаут ожидания кнопки. Переход к следующему пользователю.');
            observer.disconnect();
            goToNextUser();
        }, BUTTON_WAIT_TIMEOUT); // 5 секунд
    }

    // Запуск автоматизации после загрузки страницы
    window.addEventListener('load', () => {
        // Проверка, что мы на странице пользователя
        if (/^\/users\/\d+/.test(window.location.pathname)) {
            waitForButton();
        } else {
            console.log('Скрипт активен только на страницах пользователей.');
        }
    });
})();
