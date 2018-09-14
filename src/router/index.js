/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const Home = resolve => {
	import('@/view/home/Home.vue').then(module => {
		resolve(module)
	})
}
const Me = resolve => {
	import('@/view/me/Me.vue').then(module => {
		resolve(module)
	})
}
const Movie = resolve => {
	import('@/view/movie/Movie.vue').then(module => {
		resolve(module)
	})
}
const Shop = resolve => {
	import('@/view/shop/Shop.vue').then(module => {
		resolve(module)
	})
}
const ToPay = resolve => {
	import('@/view/shop/to-pay.vue').then(module => {
		resolve(module)
	})
}
const ConfirmOrder = resolve => {
	import('@/view/order/confirmOrder.vue').then(module => {
		resolve(module)
	})
}
const ConfirmPayment = resolve => {
	import('@/view/order/confirmPayment.vue').then(module => {
		resolve(module)
	})
}
const PaymentSuccess = resolve => {
	import('@/view/order/paymentSuccess.vue').then(module => {
		resolve(module)
	})
}
const AlipayOpen = resolve => {
	import('@/view/order/alipayOpen.vue').then(module => {
		resolve(module)
	})
}
const AlipayPayment = resolve => {
	import('@/view/order/alipayPayment.vue').then(module => {
		resolve(module)
	})
}
const FilmPlan = resolve => {
	import('@/view/filmPlan/film-plan.vue').then(module => {
		resolve(module)
	})
}
const BuySeat = resolve => {
	import('@/view/filmPlan/buySeat.vue').then(module => {
		resolve(module)
	})
}
const Cinema = resolve => {
	import('@/components/common/selectCinema.vue').then(module => {
		resolve(module)
	})
}
const MemberCode = resolve => {
	import('@/view/me/member_code.vue').then(module => {
		resolve(module)
	})
}
const OrderList = resolve => {
	import('@/view/me/orderList.vue').then(module => {
		resolve(module)
	})
}
const OrderDetail = resolve => {
	import('@/view/me/orderDetail.vue').then(module => {
		resolve(module)
	})
}
const MemberCard = resolve => {
	import('@/view/me/member-card.vue').then(module => {
		resolve(module)
	})
}
const AddCard = resolve => {
	import('@/view/me/add-card.vue').then(module => {
		resolve(module)
	})
}
const CardDetail = resolve => {
	import('@/view/me/card-detail.vue').then(module => {
		resolve(module)
	})
}
const Login = resolve => {
	import('@/view/me/login.vue').then(module => {
		resolve(module)
	})
}
const UnpayOrder = resolve => {
	import('@/view/order/unpayOrder.vue').then(module => {
		resolve(module)
	})
}
const MemberRechange = resolve => {
	import('@/view/me/member-rechange.vue').then(module => {
		resolve(module)
	})
}

const Sell = resolve => {
	import('@/view/sell/sell.vue').then(module => {
		resolve(module)
	})
}

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			redirect: '/home',
			meta: { title: '首页' }
		},
		{
			path: '/home',
			name: 'home',
			component: Home
		},
		{
			path: '/movie',
			name: 'movie',
			component: Movie,
			meta: { title: '排期' }
		},
		{
			path: '/shop',
			name: 'shop',
			component: Shop
		},
		{
			path: '/me',
			name: 'me',
			component: Me
		},
		{
			path: '/confirmOrder',
			name: 'confirmOrder',
			component: ConfirmOrder
		},
		{
			path: '/filmplan',
			name: 'filmplan',
			component: FilmPlan
		},
		{
			path: '/confirmPayment',
			name: 'confirmPayment',
			component: ConfirmPayment
		},
		{
			path: '/paymentSuccess',
			name: 'paymentSuccess',
			component: PaymentSuccess
		},
		{
			path: '/cinema',
			name: 'cinema',
			component: Cinema
		},
		{
			path: '/buyseat',
			name: 'buyseat',
			component: BuySeat,
			meta: { title: '选座' }
		},
		{
			path: '/topay',
			name: 'topay',
			component: ToPay
		},
		{
			path: '/alipayOpen',
			name: 'alipayOpen',
			component: AlipayOpen
		},
		{
			path: '/alipayPayment',
			name: 'alipayPayment',
			component: AlipayPayment
		},
		{
			path: '/memberCode',
			name: 'memberCode',
			component: MemberCode
		},
		{
			path: '/orderList',
			name: 'orderList',
			component: OrderList
		},
		{
			path: '/orderDetail',
			name: 'orderDetail',
			component: OrderDetail
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/membercard',
			name: 'membercard',
			component: MemberCard
		},
		{
			path: '/addcard',
			name: 'addcard',
			component: AddCard
		},
		{
			path: '/carddetail',
			name: 'carddetail',
			component: CardDetail
		},
		{
			path: '/unpayorder',
			name: 'unpayorder',
			component: UnpayOrder
		},
		{
			path: '/memberrechange',
			name: 'memberrechange',
			component: MemberRechange
		},
		{
			path: '/sell',
			name: 'sell',
			component: Sell
		}
	]
})
router.beforeEach((to, from, next) => {
	//beforeEach是router的钩子函数，在进入路由前执行
	if (to.path !== global.location.pathname) {
		location.assign(to.fullPath)
	}
	if (to.meta.title) {
		//判断是否有标题
		document.title = to.meta.title
	}
	next() //执行进入路由，如果不写就不会进入目标页
})
export default router
