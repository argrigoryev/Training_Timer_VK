import React, {useState, Fragment} from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Group, Div, Button, CardGrid } from '@vkontakte/vkui';
import Icon24ThumbUp from '@vkontakte/icons/dist/24/thumb_up';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Slider from '@vkontakte/vkui/dist/components/Slider/Slider';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Counter from '@vkontakte/vkui/dist/components/Counter/Counter';
import Card from '@vkontakte/vkui/dist/components/Card/Card';

import './Timer.css'

const DEFAULT_WORKING_TIME = 40000;
const DEFAULT_REST_TIME = 20000;
const DEFAULT_ROUNDS = 3;

// const IS_TAPTIC_SUPPORTED = bridge.supports('VKWebAppTapticNotificationOccured');

function throttle(callback, delay) {
	let isThrottled = false, args, context;

	function wrapper() {
		if (isThrottled) {
			args = arguments;
			context = this;
			return;
		}

		isThrottled = true;
		callback.apply(this, arguments);
		
		setTimeout(() => {
			isThrottled = false;
			if (args) {
				wrapper.apply(context, args);
				args = context = null;
			}
		}, delay);
	}
	return wrapper;
}

const Timer = ({fetchedState, snackbarError}) => {
    const [snackbar, setSnackbar] = useState(snackbarError);

    const [userWorkingTime, setUserWorkingTime] = useState(fetchedState.hasOwnProperty('userWorkingTime') ? fetchedState.workingTime : DEFAULT_WORKING_TIME);
    const [userRestTime, setUserRestTime] = useState(fetchedState.hasOwnProperty('userRestTime') ? fetchedState.workingTime : DEFAULT_REST_TIME);
    const [userRounds, setUserRounds] = useState(fetchedState.hasOwnProperty('userRounds') ? fetchedState.workingTime : DEFAULT_ROUNDS);

    let workingTime = userWorkingTime;
    let rounds = userRounds;
    let restTime = userRestTime;

    const setStorage = async function(properties) {
		await bridge.send('VKWebAppStorageSet', {
			key: 'state',
			value: JSON.stringify({
				userWorkingTime,
				userRestTime,
				userRounds,
				...properties
			})
		});
	}
    
    const startRestTimer = () => {
        let time = setInterval(() => {
            if (restTime !== 0) {
                restTime -= 1000;
                document.querySelector("#rest").textContent = restTime/1000;
            } else {
                clearInterval(time);
            }
        }, 1000)
    }

    const startWorkingTimer = () => {
        let time = setInterval(() => {
            if (workingTime !== 0) {
                workingTime -= 1000;
                document.querySelector("#work").textContent = workingTime/1000;
            } else {
                clearInterval(time);
                startRestTimer();
                restTime = userRestTime;
            }
        }, 1000)
    }

    const startRounds = () => {
        document.querySelector('#round').textContent = `${[rounds]}/${userRounds}`;
        startWorkingTimer();
        rounds--;
        let time = setInterval(() => {
            if (rounds !== 0) {
                document.querySelector('#round').textContent = `${[rounds]}/${userRounds}`;
                startWorkingTimer();
                workingTime = userWorkingTime;
                rounds--;
            } else {
                clearInterval(time);
                document.querySelector('#round').textContent = `${[rounds]}/${userRounds}`;
                setSnackbar(<Snackbar
                    layout='vertical'
                    onClose={() => setSnackbar(null)}
                    before={<Avatar size={24} style={{backgroundColor: 'var(--accent)'}}><Icon24ThumbUp fill='#fff' width={14} height={14} /></Avatar>}
                    duration={1500}
                >
                    Поздравляем с завершенной тренировкий!
                </Snackbar>);
            }
        }, userWorkingTime + userRestTime)
    }

    const onRoundsChange = throttle(Rounds => {
        if (Rounds === userRounds) return;
        setUserRounds(Rounds);
        // setStorage();
    }, 200);

    const onWorkingTimeChange = throttle(time => {
        if (time === userWorkingTime) return;
        setUserWorkingTime(time);
        // setStorage();
    }, 200);

    const onRestTimeChange = throttle(time => {
        if (time === userRestTime) return;
        setUserRestTime(time);
        // setStorage();
    }, 200);

    return (
        <Fragment>
            <Group separator="hide">
                <CardGrid>
                    <Card size='l'>
                        <Div className='Info'>
                            <h1>Осталось раундов</h1>
                            <h3 className='InfoValue' id='round'>{userRounds}/{userRounds}</h3>
                        </Div>
                    </Card>
                    <Card size='m'>
                        <Div className='Info'>
                            <h1>Работа</h1>
                            <h3 className='InfoValue' id='work'>{userWorkingTime/1000}</h3>
                        </Div>
                    </Card>
                    <Card size='m'>
                        <Div className='Info'>
                            <h1>Отдых</h1>
                            <h3 className='InfoValue' id='rest'>{userRestTime/1000}</h3>
                        </Div>
                    </Card>
                </CardGrid>
            </Group>

            <Div className="BtnContainer">
                <Button  className='PauseBtn' size='xl' mode='destructive'>
					Пауза
				</Button>

                <Button  className='PlayBtn' size='xl' mode='commerce' onClick={startRounds}>
					Старт
				</Button>
            </Div>

            <Group separator="hide">
                <CardGrid>
                    <Card size='l'>
                        <Div>
                            <Header className='Header' indicator={<Counter size='m' mode='primary'>{userRounds}</Counter>}>
				                <span role='img' aria-label='Rounds'>🔄</span> Количество раундов
				            </Header>
                            <Slider
                                className='Slider'
				                step={1}
				                min={1}
				                max={10}
				                value={Number(userRounds)}
                                onChange={Rounds => onRoundsChange(Rounds)}
			                />
                        </Div>
                    </Card>

                    <Card size='l'>
                        <Div>
                            <Header className='Header' indicator={<Counter size='m' mode='primary'>{userWorkingTime/1000}</Counter>}>
					            <span role='img' aria-label='Medal'>🏅</span> Время подхода
				            </Header>
                            <Slider
                                className='Slider'
				                step={5000}
				                min={5000}
				                max={120000}
                                value={userWorkingTime}
				                onChange={time => onWorkingTimeChange(time)}
			                />
                        </Div>
                    </Card>

                    <Card size='l'>
                        <Div>
                            <Header className='Header' indicator={<Counter size='m' mode='primary'>{userRestTime/1000}</Counter>}>
					            <span role='img' aria-label='Rest'>🧘‍♂️</span> Время отдыха
				            </Header>
                            <Slider
                                className='Slider'
				                step={5000}
				                min={5000}
				                max={120000}
				                value={Number(userRestTime)}
				                onChange={time => onRestTimeChange(time)}
			                />
                        </Div>
                    </Card>
                </CardGrid>
            </Group>
            <audio id='end' preload='auto' src=''></audio>
            {snackbar}
        </Fragment>
    );
}

export default Timer;
