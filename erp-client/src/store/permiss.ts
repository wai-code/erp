import { defineStore } from 'pinia';
import * as api from '../api'
import { MenuItem } from '../interfaces';

export const usePermissStore = defineStore('permiss', {
	state: () => {
		const username = localStorage.getItem('username');
		const menus: MenuItem[] = [];
		return {
			username,
			menus
		};
	},
	getters: {
		getMenus(): MenuItem[] {
			return this.menus;
		},
	},
	actions: {
		async init() {
			if (!this.username) {
				this.menus = [];
				return;
			}
			let response = await api.getUserPermission(this.username);
			if (!response || response.status != 200) {
				this.menus = [];
				return;
			}

			console.log(response.data);
			this.menus = <MenuItem[]>response.data;
		}
	}
});
