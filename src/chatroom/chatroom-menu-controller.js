define(['../app', '../qiscus/qiscus-service', '../connectivity/connectivity-service', './chatroom-directive', 'angular-material'],
function(app) {
	app.controller('ChatroomMenuController', ['$scope', '$location', '$materialSidenav', 'user', 'connectivityEvent',
		function($scope, $location, $materialSidenav, user, connectivityEvent) {
			var _this = this;
			$scope.leftStatus = true;
			$scope.rightStatus = true;
			$scope.connectivityStatus = "Online";
			$scope.currentUser = user;

			connectivityEvent.addOnlineHandler(function() {
				$scope.connectivityStatus = "Online";
			});

			connectivityEvent.addOfflineHandler(function() {
				$scope.connectivityStatus = "Offline";
			});

			$scope.openLeftMenu = function() {
				$materialSidenav('left').toggle();
			};
			$scope.openRightMenu = function() {
				$materialSidenav('right').toggle();
			};
			$scope.showRightMenu = function() {
				$materialSidenav('right').open();
			};
			$scope.toggleLeftMenu = function() {
				_this.leftStatus = !_this.leftStatus;
			};
			$scope.toggleRightMenu = function() {
				_this.rightStatus = !_this.rightStatus;
			};
			$scope.isMaximized = function(){
				return chrome.app.window.current().isMaximized();
			}

			$scope.logout = function(){
				user.clearData();
				$location.url('frame/login');

			}

			$scope.refresh = function() {
				// Clear the data.
				user.clearData();
				
				// Start reloading.
				user.loadRooms()
				.then(function(){
					return user.selectRoom(user.rooms[0].id);
				})
				.then(function(){
					return user.selectTopic(user.selected.room.lastTopicId);
				});
			}

			this.notificationId = 1;
			$scope.createNotification = function(){
				var options = {
					type: "basic",
					title: "Notifications",
					message: "Primary message to display",
					iconUrl: "bonjour-128.png"
				}
				chrome.notifications.create("id"+_this.notificationId++,options,function(notificationId){
					setTimeout(function() {
						chrome.notifications.clear(notificationId, function(wasCleared) {
							console.log("Notification " + notificationId + " cleared: " + wasCleared);
						});
					}, 3000);
				});
			}
		}]
	);
});
