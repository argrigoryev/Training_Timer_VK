import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Timer from '../components/Timer'


const Home = ({ id, fetchedState, snackbarError }) => (
	<Panel id={id}>
		<PanelHeader>Табата</PanelHeader>
		{fetchedState && <Timer fetchedState={fetchedState} snackbarError={snackbarError} />}
	</Panel>
);

export default Home;
