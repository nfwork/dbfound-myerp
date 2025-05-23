import Router from 'vue-router';
import Vue from 'vue';
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import MyPage from '@/pages/MyPage.vue';
import ItemManage from '@/pages/ItemManage.vue';
import ItemQuery from '@/pages/ItemQuery.vue';
import ItemDetailAdd from '@/pages/ItemDetailAdd.vue';
import ItemDetailSave from '@/pages/ItemDetailSave.vue';
import BudgetAmount from '@/pages/BudgetAmount.vue';
import AccountAmount from '@/pages/AccountAmount.vue';
import PeriodAmount from '@/pages/PeriodAmount.vue';
import ExpPeriod from '@/pages/ExpPeriod.vue';
import ExpAccount from '@/pages/ExpAccount.vue';
import ExpBudget from '@/pages/ExpBudget.vue';
import ProfitRecord from '@/pages/ProfitRecord.vue';
import ProfitArchive from '@/pages/ProfitArchive.vue';

Vue.use(Router);

const router  = new Router({
    routes:[
        {
            name:'home',
            path:'/',
            component:HomePage
        },{
            name:'loginPage',
            path:'/login',
            component:LoginPage
        },{
            name:'myPage',
            path:'/my',
            component:MyPage
        },{
            name:'itemManage',
            path:'/itemManage',
            component:ItemManage
        },{
            name:'itemQuery',
            path:'/itemQuery',
            component:ItemQuery
        },{
            name:'itemDetailAdd',
            path:'/itemDetailAdd',
            component:ItemDetailAdd
        },{
            name:'itemDetailSave',
            path:'/itemDetailSave',
            component:ItemDetailSave
        },{
            name:'budgetAmount',
            path:'/budgetAmount',
            component:BudgetAmount
        },{
            name:'accountAmount',
            path:'/accountAmount',
            component:AccountAmount
        },{
            name:'periodAmount',
            path:'/periodAmount',
            component:PeriodAmount
        },{
            name:'expPeriod',
            path:'/expPeriod',
            component:ExpPeriod
        },{
            name:'expAccount',
            path:'/expAccount',
            component:ExpAccount
        },{
            name:'expBudget',
            path:'/expBudget',
            component:ExpBudget
        },{
            name:'profitRecord',
            path:'/profitRecord',
            component:ProfitRecord
        },{
            path: '/profitArchive',
            name: 'ProfitArchive',
            component: ProfitArchive
        }
    ]
});

export default router;
