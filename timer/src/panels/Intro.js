import React, { Fragment } from 'react';
import { platform, Group, Div, Avatar, FixedLayout, Button } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';

import './Intro.css';

const osName = platform();

const Intro = ({id, snackbarError, fetchedUser, userHasSeenIntro, go}) => {
	return (
		<Panel id={id} centered={true}>
			<PanelHeader>
				Таймер для тренировок
			</PanelHeader>
			{(!userHasSeenIntro && fetchedUser) && 
				<Fragment>
					<Group>
						<Div className="User">
							{fetchedUser.photo_200 && <Avatar src={fetchedUser.photo_200} />}
							<h2>Привет, {fetchedUser.first_name}!</h2>
							<h3>Таймер для тренировок - удобное мини-приложение вконтакте, которое позволит Вам точно засекать время подхода в течение интервальной тренировки</h3>
						</Div>
					</Group>
				<FixedLayout vertical='bottom'>
					<Div>
						<Button mode='commerce' size='xl' onClick={go}>
							ОК, все понятно
						</Button>
					</Div>
				</FixedLayout>
				</Fragment>
			}
			{snackbarError}
		</Panel>
	)
};

export default Intro;
