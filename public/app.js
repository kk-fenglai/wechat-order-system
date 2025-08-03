const { createApp } = Vue;

createApp({
    data() {
        return {
            currentView: 'orderForm',
            loading: false,
            isSubmitting: false,
            orders: [],
            selectedOrder: null,
            statusFilter: '',
            stats: {
                totalOrders: 0,
                completedOrders: 0,
                totalRevenue: 0
            },
            orderForm: {
                wechatId: '',
                customerInfo: {
                    name: '',
                    phone: '',
                    email: '',
                    address: ''
                },
                declaration: {
                    purpose: '',
                    items: []
                },
                pickupMethod: ''
            }
        };
    },
    computed: {
        totalValue() {
            return this.orderForm.declaration.items.reduce((sum, item) => {
                return sum + (parseFloat(item.value) || 0) * (parseInt(item.quantity) || 0);
            }, 0);
        },
        totalWeight() {
            return this.orderForm.declaration.items.reduce((sum, item) => {
                return sum + (parseFloat(item.weight) || 0) * (parseInt(item.quantity) || 0);
            }, 0);
        },
        estimatedShipping() {
            const basePrice = 5;
            const perKg = 2;
            return basePrice + (this.totalWeight * perKg);
        },
        pickupFee() {
            return this.orderForm.pickupMethod === 'delivery' ? 15 : 10;
        }
    },
    mounted() {
        this.loadStats();
    },
    methods: {
        // 视图切换
        showOrderForm() {
            this.currentView = 'orderForm';
        },
        showOrderList() {
            this.currentView = 'orderList';
            this.loadOrders();
        },
        showStats() {
            this.currentView = 'stats';
            this.loadStats();
        },

        // 订单表单操作
        addItem() {
            this.orderForm.declaration.items.push({
                name: '',
                quantity: 1,
                value: 0,
                weight: 0,
                description: ''
            });
        },
        removeItem(index) {
            this.orderForm.declaration.items.splice(index, 1);
        },
        async createOrder() {
            if (this.orderForm.declaration.items.length === 0) {
                this.showAlert('请至少添加一个物品', 'warning');
                return;
            }

            this.isSubmitting = true;
            try {
                const orderData = {
                    wechatId: this.orderForm.wechatId,
                    customerInfo: this.orderForm.customerInfo,
                    declaration: {
                        purpose: this.orderForm.declaration.purpose,
                        items: this.orderForm.declaration.items,
                        totalValue: this.totalValue,
                        totalWeight: this.totalWeight
                    },
                    pickupMethod: this.orderForm.pickupMethod
                };

                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();

                if (result.success) {
                    this.showAlert('订单创建成功！', 'success');
                    this.resetForm();
                    this.showOrderList();
                } else {
                    this.showAlert(result.error || '创建订单失败', 'danger');
                }
            } catch (error) {
                console.error('创建订单错误:', error);
                this.showAlert('网络错误，请稍后重试', 'danger');
            } finally {
                this.isSubmitting = false;
            }
        },
        resetForm() {
            this.orderForm = {
                wechatId: '',
                customerInfo: {
                    name: '',
                    phone: '',
                    email: '',
                    address: ''
                },
                declaration: {
                    purpose: '',
                    items: []
                },
                pickupMethod: ''
            };
        },

        // 订单列表操作
        async loadOrders() {
            this.loading = true;
            try {
                const params = new URLSearchParams();
                if (this.statusFilter) {
                    params.append('status', this.statusFilter);
                }

                const response = await fetch(`/api/orders?${params}`);
                const result = await response.json();

                if (result.success) {
                    this.orders = result.orders;
                } else {
                    this.showAlert(result.error || '加载订单失败', 'danger');
                }
            } catch (error) {
                console.error('加载订单错误:', error);
                this.showAlert('网络错误，请稍后重试', 'danger');
            } finally {
                this.loading = false;
            }
        },
        viewOrder(order) {
            this.selectedOrder = order;
            const modal = new bootstrap.Modal(document.getElementById('orderModal'));
            modal.show();
        },
        getStatusBadgeClass(status) {
            const statusClasses = {
                '信息收集': 'bg-secondary',
                '信息审核': 'bg-info',
                '地址分配': 'bg-primary',
                '包裹入库': 'bg-warning',
                '内容检查': 'bg-info',
                '重新打包': 'bg-warning',
                '费用计算': 'bg-info',
                '等待付款': 'bg-warning',
                '已付款': 'bg-success',
                '运输中': 'bg-primary',
                '待取件': 'bg-info',
                '已完成': 'bg-success'
            };
            return statusClasses[status] || 'bg-secondary';
        },

        // 统计信息
        async loadStats() {
            try {
                const response = await fetch('/api/orders/stats');
                const result = await response.json();

                if (result.success) {
                    this.stats = {
                        totalOrders: result.stats.totalOrders,
                        completedOrders: result.stats.byStatus.find(s => s._id === '已完成')?.count || 0,
                        totalRevenue: result.stats.totalRevenue
                    };
                }
            } catch (error) {
                console.error('加载统计信息错误:', error);
            }
        },

        // 工具方法
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        showAlert(message, type = 'info') {
            // 创建提示元素
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
            alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
            alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

            document.body.appendChild(alertDiv);

            // 3秒后自动移除
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 3000);
        }
    }
}).mount('#app'); 