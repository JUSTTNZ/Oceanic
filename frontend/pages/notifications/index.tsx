"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../hooks/toast";
import { apiClients } from "@/lib/apiClient";
import Header from "../login/header";
import Footer from "../login/footer";
import { FaBell, FaCheck } from "react-icons/fa";

interface Notification {
  _id: string;
  type: 'transaction_confirmed' | 'payment_received';
  message: string;
  txid?: string;
  amount?: number;
  coin?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
  const { ToastComponent, showToast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await apiClients.request(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notifications`,
          {
            method: 'GET',
            credentials: 'include'
          }
        );

        if (!res.ok) {
          showToast("Failed to fetch notifications", "error");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setNotifications(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        showToast("Error loading notifications", "error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [showToast]);

  const handleMarkAsRead = async (notificationId: string) => {
    setMarkingAsRead(notificationId);
    try {
      const res = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          credentials: 'include'
        }
      );

      if (!res.ok) {
        showToast("Failed to mark as read", "error");
        return;
      }

      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      showToast("Marked as read", "success");
    } catch (err) {
      showToast("Error marking notification", "error");
      console.error(err);
    } finally {
      setMarkingAsRead(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notifications/mark-all/read`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );

      if (!res.ok) {
        showToast("Failed to mark all as read", "error");
        return;
      }

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      showToast("All marked as read", "success");
    } catch (err) {
      showToast("Error marking all", "error");
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <section className="bg-gray-900 min-h-screen">
      <Header />
      <div className="min-h-screen p-4 pt-20 pb-16 font-grotesk">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/30 border border-gray-700/20 rounded-xl">
              <FaBell className="text-4xl text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No notifications yet</h3>
              <p className="text-gray-400">You'll see transaction updates here when admin confirms your payments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`p-5 rounded-xl border transition-all ${
                    notification.isRead
                      ? 'bg-gray-800/20 border-gray-700/20'
                      : 'bg-gradient-to-r from-blue-900/30 to-blue-800/20 border-blue-500/30 hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Icon + Title */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                          notification.type === 'transaction_confirmed' 
                            ? 'bg-green-500/20' 
                            : 'bg-blue-500/20'
                        }`}>
                          <FaCheck className={notification.type === 'transaction_confirmed' ? 'text-green-400' : 'text-blue-400'} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">
                            {notification.type === 'transaction_confirmed' ? 'Transaction Confirmed' : 'Payment Received'}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      <p className="text-gray-300 mb-3">{notification.message}</p>

                      {/* Transaction Details */}
                      {notification.txid && (
                        <div className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-3 mb-3 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-400">Transaction ID</p>
                              <p className="text-gray-200 font-mono text-xs break-all">{notification.txid}</p>
                            </div>
                            {notification.amount && notification.coin && (
                              <div>
                                <p className="text-gray-400">Amount</p>
                                <p className="text-gray-200 font-semibold">{notification.amount} {notification.coin}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        disabled={markingAsRead === notification._id}
                        className="ml-4 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {markingAsRead === notification._id ? 'Marking...' : 'Mark Read'}
                      </button>
                    )}
                  </div>

                  {/* Read Status Badge */}
                  {notification.isRead && (
                    <div className="ml-13 text-xs text-gray-500 flex items-center gap-1">
                      <FaCheck className="text-xs" /> Read
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </section>
  );
}
