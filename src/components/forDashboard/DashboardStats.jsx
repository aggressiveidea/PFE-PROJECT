import { FileText, MessageSquare, BookOpen, AlertCircle } from "lucide-react";
import "./DashboardStats.css";

const DashboardStats = ({ stats, activeTab, setActiveTab }) => {
  return (
    <div className="dashboard-stats-container">
      <div
        className={`dashboard-stat-card ${
          activeTab === "articles" ? "active" : ""
        }`}
        onClick={() => setActiveTab("articles")}
      >
        <div className="dashboard-stat-header">
          <h3 className="dashboard-stat-title">Articles</h3>
          <div className="dashboard-stat-icon dashboard-stat-icon-articles">
            <FileText size={18} />
          </div>
        </div>
        <p className="dashboard-stat-value">{stats.pendingArticles}</p>
        <div className="dashboard-stat-footer">
          {stats.pendingArticles > 0 && (
            <span className="dashboard-stat-pending">
              <AlertCircle size={14} />
              {stats.pendingArticles} pending
            </span>
          )}
        </div>
      </div>

      <div
        className={`dashboard-stat-card ${
          activeTab === "messages" ? "active" : ""
        }`}
        onClick={() => setActiveTab("messages")}
      >
        <div className="dashboard-stat-header">
          <h3 className="dashboard-stat-title">Messages</h3>
          <div className="dashboard-stat-icon dashboard-stat-icon-messages">
            <MessageSquare size={18} />
          </div>
        </div>
        <p className="dashboard-stat-value">{stats.pendingMessages}</p>
        <div className="dashboard-stat-footer">
          {stats.pendingMessages > 0 && (
            <span className="dashboard-stat-pending">
              <AlertCircle size={14} />
              {stats.pendingMessages} pending
            </span>
          )}
        </div>
      </div>

      <div
        className={`dashboard-stat-card ${
          activeTab === "terms" ? "active" : ""
        }`}
        onClick={() => setActiveTab("terms")}
      >
        <div className="dashboard-stat-header">
          <h3 className="dashboard-stat-title">Terms</h3>
          <div className="dashboard-stat-icon dashboard-stat-icon-terms">
            <BookOpen size={18} />
          </div>
        </div>
        <p className="dashboard-stat-value">{stats.pendingTerms}</p>
        <div className="dashboard-stat-footer">
          {stats.pendingTerms > 0 && (
            <span className="dashboard-stat-pending">
              <AlertCircle size={14} />
              {stats.pendingTerms} pending
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
